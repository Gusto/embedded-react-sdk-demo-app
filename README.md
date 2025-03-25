# Gusto Embedded SDK Demo

This repository contains a demo application showcasing the integration of Gusto's Embedded SDK. It includes a proxy server for the Gusto API and a React frontend client.

## Project Structure

- `/backend` - Express.js proxy server for Gusto API
- `/frontend` - React + TypeScript frontend application using Gusto's Embedded SDK

## Setup Instructions

### Backend Setup

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

4. Edit `.env` and add your Gusto API token:

```
GUSTO_API_TOKEN=your_actual_token_here
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

## Development

- Backend proxy server forwards requests to `https://api.gusto-demo.com`
- All requests include necessary Gusto API headers and client IP addresses
- Frontend is built with React + TypeScript + Vite
- Uses Gusto's Embedded React SDK for integration

## Environment Variables

### Backend

- `GUSTO_API_TOKEN` - Your Gusto API token (required)
