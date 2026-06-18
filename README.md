# Gusto Embedded SDK Demo

This repository is a reference app for building with the [Gusto Embedded React SDK](https://github.com/Gusto/embedded-react-sdk). It demonstrates how to orchestrate the SDK's individual **block** components together with a router across every domain — company onboarding, employee onboarding, self-onboarding, running payroll, managing employees, terminations, and time off — so you can see the connective tissue an integration needs, not just a single screen.

If you are a partner developer coming in to learn the SDK (or to spin up a working demo of your own), start with the [build approaches](#build-approaches) below to understand the spectrum of integration styles, then browse the [examples inventory](#examples-available) to jump to the flow you care about.

The app has two parts:

- `/backend` — Express.js proxy server for the Gusto API (holds your credentials, injects the auth token)
- `/frontend` — React + TypeScript app composing the Gusto Embedded React SDK behind `react-router-dom`

## Build approaches

The SDK supports a spectrum of integration styles, from turnkey to fully custom. This repo focuses on the middle of that spectrum — **composing blocks behind a router** — because that is where most of the "how do the pieces fit together" questions live.

- **Flow components** orchestrate an entire domain for you. A single component (e.g. `EmployeeOnboarding.OnboardingFlow`) drives all of its own steps, in order, in memory. This is the least wiring, but the sub-steps are not URL-addressable and a refresh restarts the flow. Reach for these when you want a drop-in experience and don't need to own navigation. You can see one embedded inside [`company-onboarding/pages/CompanyOnboarding.tsx`](./frontend/src/demos/company-onboarding/pages/CompanyOnboarding.tsx).
- **Block components** are the core of what this repo demonstrates. Each block is one step (profile, compensation, federal taxes, a document signer, etc.) that emits events on completion. They're the right tool when you're wiring steps to a router, giving each step its own URL, or otherwise controlling custom navigation between steps.
- **Block composition** gives you even finer-grained control. Some blocks are themselves composites — the signatory assignment and document signer steps, for example, contain sub-steps (a document list, an assign-signatory step, individual signature forms, I-9 employment eligibility) that can be decomposed further for a custom experience. The `block-compositions/` directories show each sub-step wired to its own route.
- **Hooks** are the highest-customization approach and are **not** the focus of this repo. Headless form/data hooks let you own the layout entirely: rearrange form fields, place custom UI between fields, and compose fields from different forms together on one screen. If the composition demonstrated here isn't flexible enough for your needs, see the SDK's [hooks documentation](https://github.com/Gusto/embedded-react-sdk/blob/main/docs/hooks/hooks.md).

## Examples available

Each example is a self-contained, router-driven demo. The directory is where to read the composition code.

- **Onboard a new company** — [`frontend/src/demos/company-onboarding/`](./frontend/src/demos/company-onboarding/)
- **Manage an onboarded company** (dashboard shell) — [`frontend/src/demos/onboarded-company/`](./frontend/src/demos/onboarded-company/)
  - Run payroll — [`onboarded-company/run-payroll/`](./frontend/src/demos/onboarded-company/run-payroll/)
  - Manage employees — [`onboarded-company/manage-employees/`](./frontend/src/demos/onboarded-company/manage-employees/)
  - Terminations — [`onboarded-company/terminations/`](./frontend/src/demos/onboarded-company/terminations/)
  - Time off — [`onboarded-company/time-off/`](./frontend/src/demos/onboarded-company/time-off/)
  - Company settings (bank account, locations, federal/state taxes, pay schedule, documents) — [`onboarded-company/pages/`](./frontend/src/demos/onboarded-company/pages/)
- **Onboard a new employee** (as an admin) — [`frontend/src/demos/employee-onboarding/`](./frontend/src/demos/employee-onboarding/)
- **Employee self-onboarding** — [`frontend/src/demos/employee-self-onboarding/`](./frontend/src/demos/employee-self-onboarding/)

**Block-composition examples** (composite steps decomposed into per-sub-step routes):

- Company document signer — [`company-onboarding/block-compositions/CompanyDocumentSignerComposition.tsx`](./frontend/src/demos/company-onboarding/block-compositions/CompanyDocumentSignerComposition.tsx)
- Company state taxes — [`company-onboarding/block-compositions/StateTaxesComposition.tsx`](./frontend/src/demos/company-onboarding/block-compositions/StateTaxesComposition.tsx)
- Employee compensation / jobs — [`employee-onboarding/block-compositions/CompensationComposition.tsx`](./frontend/src/demos/employee-onboarding/block-compositions/CompensationComposition.tsx)
- Employee document signer (with I-9) — [`employee-self-onboarding/block-compositions/EmployeeDocumentSignerComposition.tsx`](./frontend/src/demos/employee-self-onboarding/block-compositions/EmployeeDocumentSignerComposition.tsx)

## Prerequisites

Before setting up this demo application, you'll need to:

1. **Create a developer account** at [dev.gusto.com](https://dev.gusto.com)
2. **Create a developer app** in your Gusto developer dashboard
3. **Obtain a system access token** using your app's client credentials
4. **Create a partner managed company** to get the company ID and company access token

[Each of these steps is outlined in the getting started guide for embedded here](https://docs.gusto.com/embedded-payroll/docs/getting-started).

### Step 1: Set up Developer Account and App

You'll need to create an account at [dev.gusto.com](https://dev.gusto.com), create an application, and then obtain the Client ID and Secret for that application.

1. Go to [dev.gusto.com](https://dev.gusto.com/accounts/sign_up) and create a developer account.
2. Follow the steps to create an account, set up an Organization, and create an Application.
3. On the dashboard at [dev.gusto.com](https://dev.gusto.com), navigate to Applications from the sidebar, then select your newly created application. You will see a section for `OAuth Credentials` on this page which will have the Client ID and Secret. You will need these for getting a system access token in the next step.

### Step 2: Get System Access Token

Follow the [System Access Tokens guide](https://docs.gusto.com/embedded-payroll/docs/system-access-tokens) to obtain a system access token using your app's credentials.

Make a POST request to the `/oauth/token` endpoint:

```bash
curl --location --request POST 'https://api.gusto-demo.com/oauth/token'
--header 'Content-Type: application/json'
--data-raw '{
  "client_id": "{{client_id}}",
  "client_secret": "{{client_secret}}",
  "grant_type": "system_access"
}'
```

The response will include an `access_token` that expires in 2 hours.

### Step 3: Create Partner Managed Company

Use the system access token to create a partner managed company following the [Create Partner Managed Company guide](https://docs.gusto.com/embedded-payroll/reference/post-v1-partner-managed-companies).

Make a POST request to create a company:

```bash
curl --request POST
--url https://api.gusto-demo.com/v1/partner_managed_companies
--header 'X-Gusto-API-Version: 2025-06-15'
--header 'accept: application/json'
--header 'authorization: Bearer YOUR_SYSTEM_ACCESS_TOKEN'
--header 'content-type: application/json'
--data '{
  "user": {
    "first_name": "FIRST_NAME",
    "last_name": "LAST_NAME",
    "email": "EMAIL"
  },
  "company": {
    "name": "MY_COMPANY_NAME"
  }
}'
```

The response will include:

- `company_id` - Set as `COMPANY_ID` in your frontend config (see [Frontend Setup](#frontend-setup))
- `access_token` - Not needed for the backend (tokens are auto-refreshed)
- `refresh_token` - Use this in the backend `tokens.json` file for automatic token refresh

## App Setup Instructions

### Backend Setup

The backend uses automatic token refresh to handle token expiration. You'll need to configure:

**Environment variables** (`.env`):
- `CLIENT_ID` - Your app's Client ID from the Gusto developer dashboard (required)
- `CLIENT_SECRET` - Your app's Client Secret from the Gusto developer dashboard (required)
- `GUSTO_API_BASE_URL` - Optional, defaults to `https://api.gusto-demo.com`
- `ALLOWED_ORIGINS` - Optional, comma-separated extra browser origins allowed through CORS. The proxy holds your Gusto credentials, so CORS is locked to `localhost` by default (where the demo frontend runs); add any other origins here.

**Token storage** (`tokens.json`):
- `refresh_token` - The refresh token obtained from creating a partner managed company (required)

The refresh token is stored separately because it gets automatically updated each time it's used. The backend saves the new refresh token to `tokens.json` on every refresh, so it persists across server restarts.

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` and add your OAuth credentials:

```
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
```

5. Set up token storage:

```bash
cp tokens.example.json tokens.json
```

6. Edit `tokens.json` and add your refresh token:

```json
{
  "refresh_token": "your_refresh_token_here"
}
```

The backend will automatically refresh the access token when it expires (every 2 hours) and update `tokens.json` with the new refresh token. You don't need to manually update tokens anymore.

7. Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up your config. Copy the template and fill in your IDs:

```bash
cp src/config.example.ts src/config.ts
```

`config.ts` is gitignored (like `.env`) because it holds the IDs for your own demo company. Edit it:

- `COMPANY_ID` (required) — the `company_id` from creating your partner managed company above.
- `EMPLOYEE_ID` (optional) — leave it `undefined` until you have an employee. The employee self-onboarding demo needs it and will redirect to the home page until it's set. To get one, run the **Onboard a new employee** demo to create an employee, then copy its id out of the browser URL (`/employee-onboarding/<employeeId>/...`).

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3002`

The SDK is configured in [`frontend/src/App.tsx`](./frontend/src/App.tsx), where `GustoProvider` points at the backend proxy and the per-domain route groups are mounted.

#### Finding IDs as you go

There is no global event callback on `GustoProvider` — `GustoProvider`'s only app-level hook is `config.observability` (`onError` / `onMetric`), which is for error and performance telemetry, not entity IDs. Instead, each block emits its own `onEvent(type, data)` whose payload carries the relevant IDs (for example, the newly created employee's `uuid`). In these demos the router writes that id straight into the URL, so the simplest way to grab an id is to run a flow and read it from the address bar.

## Project Structure

- `/backend` - Express.js proxy server for Gusto API
- `/frontend` - React + TypeScript frontend application using Gusto's Embedded SDK; the demos live under [`frontend/src/demos/`](./frontend/src/demos/)
