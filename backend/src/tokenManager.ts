import dotenv from "dotenv";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

dotenv.config();

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  created_at: string;
  scope: string;
}

interface TokenStorage {
  refresh_token: string;
}

export interface ConfigStatus {
  ok: boolean;
  missingClientId: boolean;
  missingClientSecret: boolean;
  missingTokensFile: boolean;
  missingRefreshToken: boolean;
  reason?: string;
}

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private systemAccessToken: string | null = null;
  private systemTokenExpiresAt: number = 0;
  private systemTokenPromise: Promise<string> | null = null;
  private readonly clientId: string;
  private readonly clientSecret: string;
  readonly baseUrl: string;
  private readonly tokensFilePath: string;
  private refreshPromise: Promise<string> | null = null;
  private readonly tokensFileExists: boolean;
  private readonly tokensFileError: string | null = null;

  constructor() {
    this.clientId = process.env.CLIENT_ID || "";
    this.clientSecret = process.env.CLIENT_SECRET || "";
    this.baseUrl =
      process.env.GUSTO_API_BASE_URL || "https://api.gusto-demo.com";
    this.tokensFilePath = join(__dirname, "../tokens.json");

    this.tokensFileExists = existsSync(this.tokensFilePath);
    if (this.tokensFileExists) {
      try {
        const fileContent = readFileSync(this.tokensFilePath, "utf-8");
        const tokenStorage: TokenStorage = JSON.parse(fileContent);
        this.refreshToken = tokenStorage.refresh_token || null;
      } catch (error) {
        this.tokensFileError =
          error instanceof Error ? error.message : String(error);
      }
    }

    console.log("TokenManager initialized.");
  }

  getConfigStatus(): ConfigStatus {
    const missingClientId = !this.clientId;
    const missingClientSecret = !this.clientSecret;
    const missingTokensFile = !this.tokensFileExists;
    const missingRefreshToken =
      this.tokensFileExists && !this.refreshToken;

    let reason: string | undefined;
    if (this.tokensFileError) reason = `tokens.json invalid: ${this.tokensFileError}`;
    else if (missingClientId || missingClientSecret)
      reason = "Set CLIENT_ID and CLIENT_SECRET in backend/.env.";
    else if (missingTokensFile)
      reason = "Copy backend/tokens.example.json to backend/tokens.json and add your refresh token.";
    else if (missingRefreshToken)
      reason = "Set refresh_token in backend/tokens.json.";

    const ok =
      !missingClientId &&
      !missingClientSecret &&
      !missingTokensFile &&
      !missingRefreshToken &&
      !this.tokensFileError;

    return {
      ok,
      missingClientId,
      missingClientSecret,
      missingTokensFile,
      missingRefreshToken,
      reason,
    };
  }

  private saveRefreshToken(refreshToken: string): void {
    try {
      const tokenStorage: TokenStorage = { refresh_token: refreshToken };
      writeFileSync(
        this.tokensFilePath,
        JSON.stringify(tokenStorage, null, 2),
        "utf-8"
      );
      console.log("Refresh token updated in tokens.json");
    } catch (error) {
      console.error("Failed to save refresh token:", error);
    }
  }

  async getAccessToken(): Promise<string> {
    const status = this.getConfigStatus();
    if (!status.ok) {
      throw new Error(status.reason || "Backend not configured.");
    }
    if (this.accessToken && this.isTokenValid()) return this.accessToken;
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.refreshAccessToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private isTokenValid(): boolean {
    const bufferSeconds = 300;
    return Date.now() < this.tokenExpiresAt - bufferSeconds * 1000;
  }

  private async refreshAccessToken(): Promise<string> {
    console.log("Refreshing access token...");
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gusto-API-Version": "2025-06-15",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: TokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.saveRefreshToken(data.refresh_token);
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

    const expiresInMinutes = Math.floor(data.expires_in / 60);
    console.log(
      `Access token refreshed successfully. Expires in ${expiresInMinutes} minutes.`
    );

    return this.accessToken;
  }

  async forceRefresh(): Promise<string> {
    this.accessToken = null;
    return this.getAccessToken();
  }

  /**
   * Get a system-level access token via the `client_credentials` grant.
   * Used for partner-level operations (e.g. creating a new partner-managed
   * company) that don't act on behalf of a specific company's user.
   */
  async getSystemAccessToken(): Promise<string> {
    const status = this.getConfigStatus();
    if (status.missingClientId || status.missingClientSecret) {
      throw new Error(
        "CLIENT_ID and CLIENT_SECRET are required for system-level operations."
      );
    }

    const bufferMs = 5 * 60 * 1000;
    if (
      this.systemAccessToken &&
      Date.now() < this.systemTokenExpiresAt - bufferMs
    ) {
      return this.systemAccessToken;
    }

    if (this.systemTokenPromise) return this.systemTokenPromise;

    this.systemTokenPromise = (async () => {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Gusto-API-Version": "2025-06-15",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "system_access",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get system token: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
      };
      this.systemAccessToken = data.access_token;
      this.systemTokenExpiresAt = Date.now() + data.expires_in * 1000;
      console.log(
        `System access token acquired. Expires in ${Math.floor(
          data.expires_in / 60
        )} minutes.`
      );
      return this.systemAccessToken;
    })();

    try {
      return await this.systemTokenPromise;
    } finally {
      this.systemTokenPromise = null;
    }
  }
}

export const tokenManager = new TokenManager();
