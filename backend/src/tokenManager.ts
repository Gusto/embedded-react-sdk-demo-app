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

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string;
  private tokenExpiresAt: number = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;
  private readonly tokensFilePath: string;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.clientId = process.env.CLIENT_ID || "";
    this.clientSecret = process.env.CLIENT_SECRET || "";
    this.baseUrl = process.env.GUSTO_API_BASE_URL || "https://api.gusto-demo.com";
    this.tokensFilePath = join(__dirname, "../tokens.json");

    // Validate required environment variables
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        "Missing required environment variables: CLIENT_ID or CLIENT_SECRET"
      );
    }

    // Load refresh token from tokens.json
    this.refreshToken = this.loadRefreshToken();

    console.log("TokenManager initialized. Will fetch access token on first request.");
  }

  /**
   * Load the refresh token.
   *
   * tokens.json is the primary source because it holds the most recently
   * rotated token (it's rewritten on every refresh). When that file is absent
   * - e.g. on an ephemeral cloud agent / CI VM where secrets are injected as
   * environment variables instead of a committed file - we fall back to the
   * GUSTO_REFRESH_TOKEN env var to seed the initial token. Once seeded, the
   * rotated token is still persisted to tokens.json for the rest of the run.
   */
  private loadRefreshToken(): string {
    const fileRefreshToken = this.loadRefreshTokenFromFile();
    if (fileRefreshToken) {
      return fileRefreshToken;
    }

    const envRefreshToken = process.env.GUSTO_REFRESH_TOKEN?.trim();
    if (envRefreshToken) {
      console.log("Seeding refresh token from GUSTO_REFRESH_TOKEN env var.");
      return envRefreshToken;
    }

    throw new Error(
      `No refresh token found at ${this.tokensFilePath}.\n` +
      "Either copy tokens.example.json to tokens.json and add your refresh token, " +
      "or set the GUSTO_REFRESH_TOKEN environment variable."
    );
  }

  /**
   * Read the refresh token from tokens.json, returning null when the file does
   * not exist or has no refresh_token. Throws only on malformed JSON.
   */
  private loadRefreshTokenFromFile(): string | null {
    if (!existsSync(this.tokensFilePath)) {
      return null;
    }

    try {
      const fileContent = readFileSync(this.tokensFilePath, "utf-8");
      const tokenStorage: TokenStorage = JSON.parse(fileContent);
      return tokenStorage.refresh_token || null;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in tokens.json: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Save refresh token to tokens.json file
   */
  private saveRefreshToken(refreshToken: string): void {
    try {
      const tokenStorage: TokenStorage = {
        refresh_token: refreshToken,
      };
      writeFileSync(this.tokensFilePath, JSON.stringify(tokenStorage, null, 2), "utf-8");
      console.log("Refresh token updated in tokens.json");
    } catch (error) {
      console.error("Failed to save refresh token:", error);
      // Don't throw - this shouldn't break the current request
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    // If we already have a valid token, return it
    if (this.accessToken && this.isTokenValid()) {
      return this.accessToken;
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new refresh
    this.refreshPromise = this.refreshAccessToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Check if the current token is still valid
   */
  private isTokenValid(): boolean {
    // Add a 5-minute buffer to prevent using a token that's about to expire
    const bufferSeconds = 300;
    return Date.now() < this.tokenExpiresAt - bufferSeconds * 1000;
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    console.log("Refreshing access token...");

    try {
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

      // Update stored tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      // Save the new refresh token to file
      this.saveRefreshToken(data.refresh_token);
      
      // Calculate expiration time
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

      const expiresInMinutes = Math.floor(data.expires_in / 60);
      console.log(`Access token refreshed successfully. Expires in ${expiresInMinutes} minutes.`);

      return this.accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  /**
   * Force a token refresh (useful for testing or manual refresh)
   */
  async forceRefresh(): Promise<string> {
    this.accessToken = null;
    return this.getAccessToken();
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();

