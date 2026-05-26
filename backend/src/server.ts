import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import {
  clearNewCompany,
  createPartnerManagedCompany,
  getCompanyAccessToken,
  getCurrentNewCompanyUuid,
} from "./companyManager";
import { tokenManager } from "./tokenManager";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Health endpoint — reports whether the backend is configured (env vars +
// tokens.json present). Frontend uses this to detect missing setup and
// surface a config reminder instead of letting SDK calls fail silently.
app.get("/health", (_req: Request, res: Response) => {
  const status = tokenManager.getConfigStatus();
  res.json(status);
});

// Forget the persisted new-company demo so the next Get Started mints a
// fresh partner-managed company. Does NOT delete the company in Gusto.
app.delete("/api/demo/new-company", (_req: Request, res: Response) => {
  clearNewCompany();
  res.status(204).end();
});

// Returns the persisted "New company" demo company without creating one.
// Lets the frontend decide whether to show the Get Started hero, the
// onboarding flow, or the dashboard on initial load.
app.get("/api/demo/new-company/current", (_req: Request, res: Response) => {
  const companyUuid = getCurrentNewCompanyUuid();
  if (!companyUuid) {
    res.status(404).json({ error: "No demo company yet." });
    return;
  }
  res.json({ companyUuid });
});

// Create a fresh partner-managed company for the "New company" demo. Returns
// the new company's uuid so the frontend can mount the SDK against it.
app.post("/api/demo/new-company", async (_req: Request, res: Response) => {
  try {
    const result = await createPartnerManagedCompany();
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to create partner-managed company:", message);
    res.status(500).json({ error: message });
  }
});

// Per-company proxy. The frontend mounts the SDK with
// `baseUrl=http://localhost:3001/demo/<companyUuid>` so each demo run uses
// the credentials we minted for that company.
app.all("/demo/:companyUuid/*", async (req: Request, res: Response) => {
  const { companyUuid } = req.params;
  try {
    const accessToken = await getCompanyAccessToken(companyUuid);
    if (!accessToken) {
      res.status(404).json({
        error: `No tokens for company ${companyUuid}. Create one via POST /api/demo/new-company first.`,
      });
      return;
    }
    const prefix = `/demo/${companyUuid}`;
    await proxyToGusto(req, res, accessToken, prefix);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Per-company proxy error:", message);
    res.status(500).json({ error: message });
  }
});

// Default proxy — uses the tokens.json refresh token (the "Existing company"
// path). All other paths flow through here for backwards compatibility.
app.all("*", async (req: Request, res: Response) => {
  try {
    const accessToken = await tokenManager.getAccessToken();
    await proxyToGusto(req, res, accessToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Proxy error:", message);
    res
      .status(500)
      .json({ error: "Failed to proxy request to Gusto API", details: message });
  }
});

async function proxyToGusto(
  req: Request,
  res: Response,
  accessToken: string,
  stripPrefix = ""
) {
  try {
    const rawPath = stripPrefix
      ? req.path.slice(stripPrefix.length) || "/"
      : req.path;
    const queryString = req.originalUrl.split("?")[1] || "";
    const targetUrl = `${tokenManager.baseUrl}${rawPath}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Proxying request to:", targetUrl);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "X-Gusto-API-Version": "2025-06-15",
      "x-gusto-client-ip": req.ip || "",
      accept: "application/json",
      host: new URL(tokenManager.baseUrl).host,
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      headers["content-type"] = "application/json";
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (text.length === 0) {
      res.status(response.status).end();
      return;
    }

    if (contentType && contentType.includes("application/json")) {
      try {
        res.status(response.status).json(JSON.parse(text));
      } catch {
        res.status(response.status).type("text/plain").send(text);
      }
    } else {
      res.status(response.status).send(text);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Proxy error:", message);
    res.status(500).json({
      error: "Failed to proxy request to Gusto API",
      details: message,
    });
  }
}

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
