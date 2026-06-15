// Shared helpers for the Cloud Agent / CI demo-company scripts.
//
// These scripts exist ONLY to bootstrap a working Gusto demo company for
// automated/CI environments (e.g. Cursor cloud agents) where there is no
// pre-existing refresh token. They are intentionally separate from the demo
// application code in /backend and /frontend, which is left untouched.

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = join(__dirname, "..");
export const TOKENS_FILE = join(REPO_ROOT, "backend", "tokens.json");
export const CONFIG_FILE = join(REPO_ROOT, "frontend", "src", "config.ts");
export const RECORD_FILE = join(__dirname, ".demo-company.json");

export const API_VERSION = "2025-06-15";
export const BASE_URL = process.env.GUSTO_API_BASE_URL || "https://api.gusto-demo.com";

export function requireClientCreds() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "CLIENT_ID and CLIENT_SECRET must be set (e.g. via the Cursor Secrets panel) to run this script."
    );
  }
  return { clientId, clientSecret };
}

// Minimal Gusto API client bound to a bearer token.
export function client(token) {
  return async function api(path, { method = "GET", body } = {}) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Gusto-API-Version": API_VERSION,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    if (!res.ok) {
      const err = new Error(
        `${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`
      );
      err.status = res.status;
      err.body = data;
      throw err;
    }
    return data;
  };
}

// Mint a system access token from client credentials. This grant never needs a
// refresh token and can be re-requested anytime, which is why client creds are
// the only durable secret required.
export async function getSystemToken() {
  const { clientId, clientSecret } = requireClientCreds();
  const api = client(null);
  const res = await api("/oauth/token", {
    method: "POST",
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "system_access",
    },
  });
  return res.access_token;
}

// Exchange a company refresh token for a fresh access token (used by the
// setup script's reuse path to validate a previously-recorded company).
export async function refreshCompanyToken(refreshToken) {
  const { clientId, clientSecret } = requireClientCreds();
  const api = client(null);
  const res = await api("/oauth/token", {
    method: "POST",
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
  });
  return { accessToken: res.access_token, refreshToken: res.refresh_token };
}

export const log = (msg) => console.log(`[gusto-demo] ${msg}`);
