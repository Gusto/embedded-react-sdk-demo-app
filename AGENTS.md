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

### Required first step for cloud agents: run `agent-setup`

ALWAYS run this as the very first step of ANY task in this repo, before reading
deeper or writing code — regardless of what you're changing:

```
bash scripts/agent-setup.sh
```

Do not try to judge whether your change "touches" auth, the backend, or the
frontend. The app is non-functional without a provisioned demo company, and the
script is idempotent and cheap when one already exists, so running it
unconditionally is always the correct, deterministic choice. The previous
"bootstrap only if it seems relevant" guidance was a footgun: a fresh agent
can't reliably tell when it's needed, so the answer is "always."

`agent-setup.sh` installs backend + frontend dependencies and then runs
`scripts/setup-demo-company.mjs`. It is named `agent-setup` (not `setup`) on
purpose: it is the automated cloud-agent/CI path, distinct from the normal
local-dev instructions in `README.md`, so humans running the demo by hand won't
mistake it for the standard run steps.

#### Why a script and not a stored token

The backend reaches Gusto with a company-scoped token that it derives from a
refresh token in `backend/tokens.json`; the frontend reads a `COMPANY_ID` (and
`EMPLOYEE_ID`) from `frontend/src/config.ts`. Both files are the only inputs the
app needs, and the application code is unchanged.

A Gusto company refresh token rotates and can't live in a static secret, and a
system token (mintable from client creds) can't access company data. So a fresh
cloud VM can't reuse a stored company token. Instead, `setup-demo-company.mjs`
provisions a brand-new, fully-onboarded, approved demo company from the only
durable secrets — `CLIENT_ID` and `CLIENT_SECRET` (set these in the Secrets
panel; they're injected as env vars). It mints a system token, creates a
partner-managed company, completes every onboarding step (address, pay schedule,
industry, federal tax, bank + verify, a fully-onboarded employee, CA tax rates,
signatory + signed forms), calls `finish_onboarding` then the demo-only
`approve`, and then writes `backend/tokens.json` and patches
`frontend/src/config.ts`. Both scripts are deliberately separate from the app
code in `backend`/`frontend`.

After `agent-setup.sh` finishes, start the dev servers normally (see
`README.md`). For purely local dev you can instead hand-fill `backend/.env` +
`backend/tokens.json` per the README; never commit real credentials.

> Even better than relying on this instruction: wire `bash scripts/agent-setup.sh`
> into the cloud agent environment's startup script (Cursor dashboard → Cloud
> Agents) so every fresh VM provisions the company automatically, with zero agent
> judgment involved.

### Non-obvious caveats

- The bootstrap script's local edit to `frontend/src/config.ts` (the company /
  employee ids) and the generated `backend/tokens.json` are runtime artifacts —
  do NOT commit them. `tokens.json` is gitignored; revert `config.ts` before
  committing.
- The setup is idempotent: re-running `agent-setup.sh` reuses installed deps and
  the recorded company (`scripts/.demo-company.json` + `backend/tokens.json`)
  instead of creating another, so running it unconditionally at the start of
  every task is safe and cheap. Provisioning only actually happens on a
  brand-new VM, so company volume is ~one per fresh agent. There is no
  delete-company API, but Gusto reclaims demo companies incrementally on its
  own, so no explicit cleanup is needed.
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
