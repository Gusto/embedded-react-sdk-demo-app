// Centralized configuration for the proxy and token manager.
// Keeping these values in one place means there are no magic strings or numbers
// scattered across the request/auth code.

import dotenv from "dotenv";

// Load .env here so every value below reads from a populated process.env. This
// module is imported before any other proxy code runs, so the env is ready
// everywhere it's needed.
dotenv.config();

export const GUSTO_API_BASE_URL =
  process.env.GUSTO_API_BASE_URL ?? "https://api.gusto-demo.com";

// Defaults to 3001 (the port the demo frontend points at). Override with PORT
// only when running multiple proxy instances side by side.
export const PORT = Number(process.env.PORT) || 3001;

// Refresh an access token this far before it actually expires, so an in-flight
// request never races a token expiring mid-call.
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

// A cross-origin browser fetch can only read custom response headers that the
// server explicitly allow-lists. The SDK reads these pagination headers off the
// fetch response to drive its list pagination controls.
export const PAGINATION_HEADERS = [
  "x-total-count",
  "x-total-pages",
  "x-page",
  "x-per-page",
];

// Extra browser origins allowed through CORS, on top of localhost. Comma-separated
// in the ALLOWED_ORIGINS env var. Empty by default.
export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
