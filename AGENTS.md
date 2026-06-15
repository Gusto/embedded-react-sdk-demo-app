# AGENTS.md

## Cursor Cloud specific instructions

This repo is a Gusto Embedded SDK demo with two independent services. Standard
setup/run commands live in `README.md` and the per-service `package.json`
scripts — refer to those rather than duplicating them here.

### Services

| Service | Dir | Dev command | Port | Notes |
| --- | --- | --- | --- | --- |
| Backend proxy | `backend` | `npm run dev` (nodemon + ts-node) | 3001 | Transparent proxy to `https://api.gusto-demo.com`, injects auth token |
| Frontend | `frontend` | `npm run dev` (Vite) | 3002 | React 19 + Gusto Embedded React SDK |

Lint: `npm run lint` (frontend only; backend has no lint script).
Build: `npm run build` in each service.

### Auth / credentials (how secrets map to the backend)

The backend authenticates to Gusto by refreshing an access token via
`POST /oauth/token` using `CLIENT_ID` + `CLIENT_SECRET` + a refresh token. There
is no raw "access token only" mode — a bare access token is not enough. In a
cloud agent, supply all three via the Secrets panel; they are injected as
environment variables and consumed as follows:

- `CLIENT_ID` / `CLIENT_SECRET`: read directly from `process.env` (`dotenv` does
  not override real env vars), so the Secrets-panel values work with no `.env`
  file needed.
- `GUSTO_REFRESH_TOKEN`: seeds the refresh token when `backend/tokens.json` is
  absent (the normal case on a fresh VM, since the file is gitignored). See
  `loadRefreshToken()` in `backend/src/tokenManager.ts`. `tokens.json`, when
  present, always takes priority over this env var.

For purely local dev you can instead use files: `cp backend/.env.example
backend/.env` (fill in `CLIENT_ID`/`CLIENT_SECRET`) and `cp
backend/tokens.example.json backend/tokens.json` (fill in `refresh_token`).
Either path works; never commit real credentials.

### Non-obvious caveats

- Gusto rotates the refresh token on every refresh, and the backend persists the
  rotated value to `backend/tokens.json`. Within a session this is seamless. But
  on a fresh cloud VM (no `tokens.json`) the backend re-seeds from the
  `GUSTO_REFRESH_TOKEN` secret — if that seed token was already consumed in a
  prior session, the refresh fails with `invalid_grant` and you must update the
  secret to a current refresh token.
- The proxy talks to the real `api.gusto-demo.com`. With missing/invalid/stale
  credentials, token refresh returns `invalid_grant` and every proxied request
  returns HTTP 500. The frontend SDK surfaces this as an "API error" dialog.
  This is expected when credentials are not wired up — the landing page and
  routing still render fine because they make no API calls.
- The frontend's backend URL is hardcoded to `http://localhost:3001` in
  `frontend/src/App.tsx` (`GustoProvider` `baseUrl`).
- `COMPANY_ID` and `EMPLOYEE_ID` are hardcoded placeholder UUIDs in
  `frontend/src/config.ts` (a committed file). The SDK flows need a real
  `company_id` that matches the backend's credentials; set these locally for
  testing but avoid committing real IDs.
