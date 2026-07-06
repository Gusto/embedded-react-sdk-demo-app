// NOTE: This file is a demo-only convenience, not a pattern to copy verbatim.
// To keep setup frictionless it stores and rotates the OAuth refresh token in a
// local tokens.json file. In your own app you'd manage these credentials the way
// you already handle secrets - e.g. a secrets manager or an encrypted datastore.

import dotenv from "dotenv";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

dotenv.config();

const GUSTO_API_BASE_URL =
  process.env.GUSTO_API_BASE_URL ?? "https://api.gusto-demo.com";

// Refresh an access token this far before it actually expires, so an in-flight
// request never races a token expiring mid-call.
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

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

// Holds your OAuth credentials and exchanges the rotating refresh token for
// short-lived access tokens, refreshing them automatically as they expire.
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string;
  private tokenExpiresAt = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokensFilePath: string;
  // While a refresh is in flight, concurrent callers await this same promise so
  // two refreshes never fire at once (which would burn the rotating token).
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.clientId = process.env.CLIENT_ID || "";
    this.clientSecret = process.env.CLIENT_SECRET || "";
    this.tokensFilePath = join(__dirname, "../tokens.json");

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        "Missing required environment variables: CLIENT_ID or CLIENT_SECRET"
      );
    }

    this.refreshToken = this.loadRefreshToken();

    console.log(
      "TokenManager initialized. Will fetch access token on first request."
    );
  }

  private loadRefreshToken(): string {
    if (!existsSync(this.tokensFilePath)) {
      throw new Error(
        `tokens.json not found at ${this.tokensFilePath}\n` +
          "Please copy tokens.example.json to tokens.json and add your refresh token."
      );
    }

    try {
      const fileContent = readFileSync(this.tokensFilePath, "utf-8");
      const tokenStorage: TokenStorage = JSON.parse(fileContent);

      if (!tokenStorage.refresh_token) {
        throw new Error("refresh_token not found in tokens.json");
      }

      return tokenStorage.refresh_token;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in tokens.json: ${error.message}`);
      }
      throw error;
    }
  }

  // Gusto rotates the refresh token on every refresh, so the new one is persisted
  // back to disk to survive server restarts.
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
      // Non-fatal: the current request still has a valid access token; only a
      // future restart would be affected.
      console.error("Failed to save refresh token:", error);
    }
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.isTokenValid()) {
      return this.accessToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshAccessToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  // Treat a token that expires within the buffer window as already expired.
  private isTokenValid(): boolean {
    return Date.now() < this.tokenExpiresAt - TOKEN_EXPIRY_BUFFER_MS;
  }

  private async refreshAccessToken(): Promise<string> {
    console.log("Refreshing access token...");

    const response = await fetch(`${GUSTO_API_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gusto-API-Version": "2025-11-15",
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
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    this.saveRefreshToken(data.refresh_token);

    const expiresInMinutes = Math.floor(data.expires_in / 60);
    console.log(
      `Access token refreshed successfully. Expires in ${expiresInMinutes} minutes.`
    );

    return this.accessToken;
  }
}

export const tokenManager = new TokenManager();
