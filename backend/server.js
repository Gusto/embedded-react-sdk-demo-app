require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Proxy all requests to Gusto API
app.all("*", async (req, res) => {
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

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${process.env.GUSTO_API_TOKEN}`,
        "X-Gusto-API-Version": "2024-04-01",
        "x-gusto-client-ip": clientIp,
        accept: "application/json",
        host: "api.gusto-demo.com",
      },
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
    console.error("Proxy error:", error.message);
    res.status(500).json({
      error: "Failed to proxy request to Gusto API",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
