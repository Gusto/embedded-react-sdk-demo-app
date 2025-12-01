import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { tokenManager } from "./tokenManager";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Proxy all requests to Gusto API
app.all("*", async (req: Request, res: Response) => {
  try {
    // Get the path and query parameters from the original request
    const path = req.path;
    const queryString = req.originalUrl.split("?")[1] || "";

    // Get client IP address
    const clientIp = req.ip;

    // Construct the target URL
    const targetUrl = `https://api.gusto-demo.com${path}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Proxying request to:", targetUrl);

    // Get a valid access token (will auto-refresh if needed)
    const accessToken = await tokenManager.getAccessToken();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "X-Gusto-API-Version": "2025-06-15",
      "x-gusto-client-ip": clientIp || "",
      accept: "application/json",
      host: "api.gusto-demo.com",
    };

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Get the content type
    const contentType = response.headers.get("content-type");

    // Handle different response types
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // For non-JSON responses, send the raw text
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error(
      "Proxy error:",
      error instanceof Error ? error.message : String(error)
    );
    res.status(500).json({
      error: "Failed to proxy request to Gusto API",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
