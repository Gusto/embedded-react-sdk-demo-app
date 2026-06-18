# Gusto Embedded SDK Demo

This repository is a reference for **orchestrating Gusto Embedded React SDK block
components behind a router**. It is aimed at partner developers learning to build
with the SDK (or spinning up a demo of their own) who want to understand how the
individual pieces connect.

The SDK ships **flow components** that run an entire flow for you. This repo
instead focuses on **block components** — the individual steps — composed behind a
router, which is what you want when you control navigation yourself. A few steps go
one level deeper with **block composition**, splitting a single step into smaller
pieces for a more custom experience. See [Build approaches](#build-approaches) for
when to reach for each, and [Examples](#examples) for where they're demonstrated.

You can also restyle the components (component adapters, theming) — see
[Customization](#customization) — and, for the most control, drop down to
**hooks**. See the [SDK hooks guide](https://github.com/Gusto/embedded-react-sdk/blob/main/docs/hooks/hooks.md).

## Project Structure

- `/backend` - Express.js proxy server for the Gusto API. It holds your
  credentials, injects the auth token, and auto-refreshes it. The transparent
  proxy is a single file: [backend/src/proxy.ts](./backend/src/proxy.ts).
- `/frontend` - React + TypeScript app composing Gusto Embedded React SDK block
  components behind `react-router-dom`. The SDK is configured once via the
  `GustoProvider` in [frontend/src/App.tsx](./frontend/src/App.tsx).

## Build approaches

From least to most custom:

- **Flow components** - turnkey, self-orchestrating components (for example
  `EmployeeOnboarding.SelfOnboardingFlow`). The least code: render one component
  and it runs every step internally.
- **Block components** - the individual steps, which you wire to your own router
  for custom navigation. This is the primary pattern in this repo; see
  [frontend/src/App.tsx](./frontend/src/App.tsx) registering the route groups.
- **Hooks** - headless customization (rearrange fields, inject custom UI, compose
  fields across forms). Beyond what this repo demonstrates; see the
  [SDK hooks guide](https://github.com/Gusto/embedded-react-sdk/blob/main/docs/hooks/hooks.md).

## Examples

Each demo is a self-contained set of block components composed behind the router.
Top-level flows (registered in [frontend/src/App.tsx](./frontend/src/App.tsx)):

- **Company onboarding** - [frontend/src/demos/company-onboarding/](./frontend/src/demos/company-onboarding/) -
  set up a brand new company on Gusto.
- **Onboarded company** - [frontend/src/demos/onboarded-company/](./frontend/src/demos/onboarded-company/) -
  manage an already-onboarded company. Contains nested sub-demos:
  - Run payroll - [run-payroll/](./frontend/src/demos/onboarded-company/run-payroll/)
  - Manage employees - [manage-employees/](./frontend/src/demos/onboarded-company/manage-employees/)
  - Terminations - [terminations/](./frontend/src/demos/onboarded-company/terminations/)
  - Time off - [time-off/](./frontend/src/demos/onboarded-company/time-off/)
  - Company settings (bank account, locations, federal taxes, state taxes, pay
    schedule, documents) - [pages/](./frontend/src/demos/onboarded-company/pages/)
- **Employee onboarding** - [frontend/src/demos/employee-onboarding/](./frontend/src/demos/employee-onboarding/) -
  onboard a new employee as an admin.
- **Employee self-onboarding** - [frontend/src/demos/employee-self-onboarding/](./frontend/src/demos/employee-self-onboarding/) -
  let an employee complete their own onboarding tasks.

### Block composition examples

For even more customization, composite blocks broken into individually routed sub-steps:

- **Company onboarding**
  - State taxes - [StateTaxesComposition.tsx](./frontend/src/demos/company-onboarding/block-compositions/StateTaxesComposition.tsx)
  - Document signer + signatory management - [CompanyDocumentSignerComposition.tsx](./frontend/src/demos/company-onboarding/block-compositions/CompanyDocumentSignerComposition.tsx) -
    splits the document-signing step into routed sub-steps: document list, assign
    signatory (create or invite), and sign a form. Also reused by the
    onboarded-company Documents settings page ([onboarded-company/pages/Documents.tsx](./frontend/src/demos/onboarded-company/pages/Documents.tsx)).
- **Employee onboarding**
  - Compensation - [CompensationComposition.tsx](./frontend/src/demos/employee-onboarding/block-compositions/CompensationComposition.tsx)
- **Employee self-onboarding**
  - Document signer - [EmployeeDocumentSignerComposition.tsx](./frontend/src/demos/employee-self-onboarding/block-compositions/EmployeeDocumentSignerComposition.tsx)

## UI Customization

Beyond composition, the SDK lets you re-skin and restyle the components. Both are
wired through the `GustoProvider` in [frontend/src/App.tsx](./frontend/src/App.tsx)
and exposed as an interactive tray in the running app so you can see the effect
live:

- **Theming** - override colors, typography, radius, shadows, and more via the
  `theme` prop:
  [frontend/src/_demo-infrastructure/theming/](./frontend/src/_demo-infrastructure/theming/).
  See the [SDK theming guide](https://github.com/Gusto/embedded-react-sdk/blob/main/docs/theming/theming-guide.md).
- **Component adapters** - swap the SDK's built-in UI primitives for your own
  component library via the `components` prop. This repo includes a complete
  Material UI adapter as a worked example:
  [frontend/src/_demo-infrastructure/component-adapters/material-ui/](./frontend/src/_demo-infrastructure/component-adapters/material-ui/).
  See the [SDK component adapter guide](https://github.com/Gusto/embedded-react-sdk/blob/main/docs/component-adapter/component-adapter.md).

## Setup

The app needs two inputs: a company refresh token for the backend
([backend/tokens.json](./backend/tokens.json)) and the company/employee ids for
the frontend ([frontend/src/config.ts](./frontend/src/config.ts)). Both are
gitignored runtime artifacts created from the committed `*.example.*` templates;
never commit them. The steps below get you there.

### 1. Register with Gusto and get your credentials (required for everyone)

To get started, you'll need an app's `CLIENT_ID` / `CLIENT_SECRET` — the
backend uses them to auto-refresh the company token, and the setup script uses them
to provision a company.

1. Create a developer account at [dev.gusto.com](https://dev.gusto.com/accounts/sign_up),
   set up an organization, and create an application.
2. Open your application's `OAuth Credentials` section to find the Client ID and
   Secret. ([Getting-started guide](https://docs.gusto.com/embedded-payroll/docs/getting-started).)
3. Put them in `backend/.env`:

   ```bash
   cd backend
   cp .env.example .env          # then set CLIENT_ID / CLIENT_SECRET
   ```

### 2. Provision a demo company with the setup script (recommended)

With your credentials in `backend/.env`, the setup script does the rest: it mints a
system access token, creates a partner-managed company, completes and approves
onboarding, seeds an employee, then writes `backend/tokens.json` and
`frontend/src/config.ts`. It is pure Node (no bash), so it runs on macOS, Windows,
and Linux.

```bash
cd backend
npm install
npm run setup                 # provisions an approved demo company and writes
                              # backend/tokens.json + frontend/src/config.ts
npm run dev                   # http://localhost:3001

# in a second terminal
cd frontend
npm install
npm run dev                   # http://localhost:3002
```

The script is idempotent: re-running reuses the recorded company instead of
creating another. (Under the hood: the `setup` script in
[backend/package.json](./backend/package.json) runs
[scripts/setup-demo-company.mjs](./scripts/setup-demo-company.mjs).)

### Alternatives to the setup script

You can skip step 2 and fill the two inputs yourself:

- **You already have a company.** Drop in its ids and refresh token directly:

  ```bash
  cd backend
  cp tokens.example.json tokens.json       # set "refresh_token"
  cd ../frontend
  cp src/config.example.ts src/config.ts   # set COMPANY_ID and EMPLOYEE_ID
  ```

  `backend/tokens.json` holds the `refresh_token` from your company (the backend
  rotates and rewrites it on every refresh). `frontend/src/config.ts` holds the
  `COMPANY_ID` and `EMPLOYEE_ID` for the entities featured in the demos. Then start
  the servers (`npm run dev` in each of `backend` and `frontend`).

- **You prefer to create the company by hand.** Follow the Gusto Embedded guides to
  mint a [system access token](https://docs.gusto.com/embedded-payroll/docs/system-access-tokens)
  and [create a partner-managed company](https://docs.gusto.com/embedded-payroll/reference/post-v1-partner-managed-companies):

  ```bash
  # 1. System access token (expires in 2 hours)
  curl --location --request POST 'https://api.gusto-demo.com/oauth/token' \
  --header 'Content-Type: application/json' \
  --data-raw '{ "client_id": "{{client_id}}", "client_secret": "{{client_secret}}", "grant_type": "system_access" }'

  # 2. Create a partner-managed company with that token
  curl --request POST \
  --url https://api.gusto-demo.com/v1/partner_managed_companies \
  --header 'X-Gusto-API-Version: 2025-06-15' \
  --header 'authorization: Bearer YOUR_SYSTEM_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "user": { "first_name": "FIRST_NAME", "last_name": "LAST_NAME", "email": "EMAIL" }, "company": { "name": "MY_COMPANY_NAME" } }'
  ```

  The create response includes `company_uuid` (your `COMPANY_ID`) and a
  `refresh_token` (for `backend/tokens.json`). For `EMPLOYEE_ID`, use the UUID of an
  employee — create one via the Employee onboarding demo and copy its id out of the
  browser URL (`/employee-onboarding/<employeeId>/...`). Then plug these into the
  files as in the previous bullet.

The frontend talks to the backend proxy at `http://localhost:3001`, configured via
the `GustoProvider` in [frontend/src/App.tsx](./frontend/src/App.tsx).
