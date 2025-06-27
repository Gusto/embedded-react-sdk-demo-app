# Gusto Embedded SDK Demo

This repository contains a demo application showcasing the integration of Gusto's Embedded SDK. It includes a proxy server for the Gusto API and a React frontend client.

## Project Structure

- `/backend` - Express.js proxy server for Gusto API
- `/frontend` - React + TypeScript frontend application using Gusto's Embedded SDK

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
3. On the dashboard at[dev.gusto.com](https://dev.gusto.com), navigate to Applications from the sidebar, then select your newly created application. You will see a section for `OAuth Credentials` on this page which will have the Client ID and Secret. You will need these for getting a system access token in the next step.

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

- `company_id` - Use this in the frontend [App.tsx](./frontend/src/App.tsx) component
- `access_token` - Use this as your `GUSTO_API_TOKEN` in the backend .env file
- `refresh_token` - Can be used to refresh your access token when it expires, [see refresh access token endpoint](https://docs.gusto.com/embedded-payroll/reference/refresh-access-token)

## App Setup Instructions

### Backend Setup

#### Environment variables

You must have a valid company access token set in your .env file in the `backend` directory. Copy paste .env.example as .env and add the company access token obtained from creating a partner managed company in the previous steps.

- `GUSTO_API_TOKEN` - Your company access token obtained in the steps above (required)

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

4. Edit `.env` and add your company access token:

```
GUSTO_API_TOKEN=your_company_access_token_here
```

5. Start the server:

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

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3002`

[Gusto Embedded React SDK components are located in the App.tsx file here](./frontend/src/App.tsx). You'll need to supply the `company_id` obtained from creating a partner managed company above to the SDK components as the `companyId` prop.
