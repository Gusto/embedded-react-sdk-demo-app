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

### Auth / zero-config bootstrap for cloud agents

The backend reaches Gusto with a company-scoped token that it derives from a
refresh token in `backend/tokens.json`; the frontend reads a `COMPANY_ID` (and
`EMPLOYEE_ID`) from `frontend/src/config.ts`. Both files are the only inputs the
app needs, and the application code is unchanged.

A Gusto company refresh token rotates and can't live in a static secret, and a
system token (mintable from client creds) can't access company data. So a fresh
cloud VM can't reuse a stored company token. Instead, a dedicated script
provisions a brand-new, fully-onboarded, approved demo company from the only
durable secrets — `CLIENT_ID` and `CLIENT_SECRET` (set these in the Secrets
panel; they're injected as env vars):

```
node scripts/setup-demo-company.mjs     # provision + seed + approve + wire up
```

`setup-demo-company.mjs` mints a system token, creates a partner-managed
company, completes every onboarding step (address, pay schedule, industry,
federal tax, bank + verify, a fully-onboarded employee, CA tax rates, signatory
+ signed forms), calls `finish_onboarding` then the demo-only `approve`, and
then writes `backend/tokens.json` and patches `frontend/src/config.ts`. This
script is deliberately separate from the app code in `backend`/`frontend`.

After running it, start the dev servers normally (see `README.md`). For purely
local dev you can instead hand-fill `backend/.env` + `backend/tokens.json` per
the README; never commit real credentials.

### Non-obvious caveats

- The bootstrap script's local edit to `frontend/src/config.ts` (the company /
  employee ids) and the generated `backend/tokens.json` are runtime artifacts —
  do NOT commit them. `tokens.json` is gitignored; revert `config.ts` before
  committing.
- The script is idempotent: re-running reuses the recorded company
  (`scripts/.demo-company.json` + `backend/tokens.json`) instead of creating
  another. Provisioning is only unavoidable on a brand-new VM, so company volume
  is ~one per fresh agent. There is no delete-company API, but Gusto reclaims
  demo companies incrementally on its own, so no explicit cleanup is needed.
- Gusto rotates the refresh token on every refresh and the backend persists the
  rotated value to `backend/tokens.json`. Don't externally exercise that refresh
  token (e.g. ad-hoc `oauth/token` calls) without saving the result, or the
  backend's stored token goes stale and refreshes fail with `invalid_grant`.
- The proxy talks to the real `api.gusto-demo.com`. With no/stale credentials,
  token refresh returns `invalid_grant` and proxied requests return HTTP 500;
  the frontend SDK shows an "API error" dialog. The landing page and routing
  still render regardless (they make no API calls).
- The frontend's backend URL is hardcoded to `http://localhost:3001` in
  `frontend/src/App.tsx` (`GustoProvider` `baseUrl`).
