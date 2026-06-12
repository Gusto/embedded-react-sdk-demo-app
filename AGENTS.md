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

### Non-obvious caveats

- The backend will NOT start without local secret files. `tokenManager.ts`
  builds a singleton at import time whose constructor throws if `backend/.env`
  is missing `CLIENT_ID`/`CLIENT_SECRET` or if `backend/tokens.json` is missing
  a `refresh_token`. Both files are gitignored and are NOT created by the update
  script, so they must be recreated each session: `cp backend/.env.example
  backend/.env` and `cp backend/tokens.example.json backend/tokens.json`, then
  fill in real values. Provide credentials via the Secrets panel; do not commit
  them.
- There is no raw "access token only" mode. The backend always refreshes via
  `POST /oauth/token` using `CLIENT_ID` + `CLIENT_SECRET` + `refresh_token`, so a
  bare access token alone is not enough — the client credentials and a valid
  refresh token are required.
- The proxy talks to the real `api.gusto-demo.com`. With placeholder/invalid
  credentials, token refresh returns `invalid_grant` and every proxied request
  returns HTTP 500. The frontend SDK surfaces this as an "API error" dialog.
  This is expected when credentials are not yet wired up — the landing page and
  routing still render fine because they make no API calls.
- The frontend's backend URL is hardcoded to `http://localhost:3001` in
  `frontend/src/App.tsx` (`GustoProvider` `baseUrl`).
- `COMPANY_ID` and `EMPLOYEE_ID` are hardcoded placeholder UUIDs in
  `frontend/src/config.ts` (a committed file). The SDK flows need a real
  `company_id` that matches the backend's credentials; set these locally for
  testing but avoid committing real IDs.
- `backend/tokens.json` is rewritten on every successful token refresh (the
  refresh token rotates), so its contents will change at runtime — that is by
  design.
