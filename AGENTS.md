# AGENTS.md

> **Audience: maintainers of this demo repo (and the AI agents that help them).**
> This file — plus the `.claude/` and `.cursor/` tooling alongside it — exists to
> build, upgrade, and run *this* demo app. It is **not** part of the Gusto Embedded
> SDK integration that partners copy. Partners learning how to integrate the SDK
> should look at `README.md` and `frontend/src/demos/` instead.

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

### Setup runs automatically — `.cursor/environment.json`

Setup is NOT left to agent discretion. `.cursor/environment.json` (committed at
the repo root) wires it into the Cursor cloud-agent boot sequence, which runs
deterministically on every fresh VM before the agent starts working:

- `install` → `npm install` in `backend` and `frontend` (checkpoint-cached).
- `start` → `bash scripts/agent-setup.sh`, which (re)installs deps and runs
  `scripts/setup-demo-company.mjs` to provision/reuse an approved demo company.

Provisioning lives in `start` (not `install`) on purpose: `start` runs fresh on
every boot and its side effects are never baked into the cached snapshot, so the
rotating company refresh token is never staled by a reused checkpoint. A
committed `.cursor/environment.json` also takes precedence over any
dashboard-configured environment, so this is the single source of truth.

If you ever need to run it by hand (local dev, or to re-provision), invoke:

```
bash scripts/agent-setup.sh
```

Do not try to judge whether your change "touches" auth, the backend, or the
frontend — the boot sequence already runs it for you, and the script is
idempotent and cheap when a company already exists. It is named `agent-setup`
(not `setup`) on purpose: it is the automated cloud-agent/CI path, distinct from
the normal local-dev instructions in `README.md`, so humans running the demo by
hand won't mistake it for the standard run steps.

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

After the boot sequence finishes (or after running `agent-setup.sh` by hand),
start the dev servers normally (see `README.md`).

For local/partner dev there is a cross-platform alternative to the cloud
`agent-setup.sh` path: put `CLIENT_ID` + `CLIENT_SECRET` in `backend/.env`, then
run `npm run setup` from the `backend` directory. That script
(`backend/package.json` -> `node -r dotenv/config ../scripts/setup-demo-company.mjs`)
loads `backend/.env` and runs the same `setup-demo-company.mjs` provisioning,
writing `backend/tokens.json` and `frontend/src/config.ts`. It is pure Node (no
bash), so it works on macOS/Windows/Linux. You can still hand-fill
`backend/.env` + `backend/tokens.json` per the README instead; never commit real
credentials.

### Non-obvious caveats

- The generated `frontend/src/config.ts` (company / employee ids) and the
  generated `backend/tokens.json` are runtime artifacts — do NOT commit them.
  Both are gitignored: `config.ts` is created from the committed
  `config.example.ts` template (copied + patched by the setup script) on first
  run, so edit `config.example.ts` for any committed config changes.
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

### SDK Upgrades and API Version Management

When upgrading the `@gusto/embedded-react-sdk` package in `frontend/package.json`,
**you MUST verify and update the API version** used by the backend and setup
scripts to match the SDK's required minimum API version.

#### How to check the SDK's API version:

1. After upgrading, inspect
   `frontend/node_modules/@gusto/embedded-react-sdk/package.json` and look for the
   `@gusto/embedded-api-v-*` dependency. The version suffix (e.g., `2025-11-15` in
   `@gusto/embedded-api-v-2025-11-15`) indicates the minimum API version required.

2. Compare this to the API version configured in:
   - `backend/src/tokenManager.ts` (the `X-Gusto-API-Version` header)
   - `scripts/gusto-demo-lib.mjs` (the `API_VERSION` constant)

3. If the SDK's required API version is newer than what's configured, update both
   files to match or exceed the SDK's minimum version.

4. Update the troubleshooting section in `README.md` (search for "API Version
   Mismatch Error") if the example API versions shown there are outdated. Keep the
   examples current with the actual versions in use.

#### Why this matters:

The Gusto API requires clients to send an `X-Gusto-API-Version` header that meets
the minimum version supported by the SDK. If the backend sends a version that's
too old, all API requests will fail with HTTP 406 and an `invalid_api_version`
error. This is a common issue when the SDK is upgraded but the backend
configuration is not updated accordingly.

**Important**: Partners using this demo app as a reference cannot update API
versions themselves. If partners encounter API version mismatch errors in their
own integrations, they must reach out to their Gusto solutions architect to update
their API version configuration. The solutions architect will ensure the correct
version is configured and verify the update has been applied correctly across the
partner's integration.
