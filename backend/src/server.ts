import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { Readable } from "node:stream";
import { tokenManager } from "./tokenManager";

dotenv.config();

const app = express();
const port = 3001;

// A cross-origin browser fetch can only read custom response headers that the
// server explicitly allow-lists here. The SDK reads the Gusto API's pagination
// headers off the fetch response to drive its list pagination controls, so we
// name them so this example shows exactly which headers matter and why.
app.use(
  cors({
    exposedHeaders: ["x-total-count", "x-total-pages", "x-page", "x-per-page"],
  })
);
// Capture the request body as a raw Buffer (any content type) so we can forward
// the SDK's bytes to the API verbatim - no JSON parse/re-serialize that could
// alter the payload or invent a body for a bodyless request.
app.use(express.raw({ type: () => true, limit: "50mb" }));

// Headers that describe a single connection hop (its framing, encoding, or
// routing) rather than the payload. fetch and Node recompute these for the hop
// they own, so forwarding the incoming values across the proxy corrupts the
// request or response - e.g. a stale Content-Length: 0 on a bodyless PUT hangs
// the upstream call, and an upstream transfer-encoding: chunked on an empty 202
// makes the browser's fetch wait forever for a body that never closes. We drop
// them in both directions and let each hop set its own.
const HOP_BY_HOP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "content-encoding",
  "transfer-encoding",
]);

function forwardableHeaders(source: Headers): Headers {
  const result = new Headers();
  source.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      result.set(key, value);
    }
  });
  return result;
}

// Transparent proxy to the Gusto API: forward the SDK's request, inject the
// server-side auth token + client IP, then relay the API's response untouched.
app.all("*", async (req: Request, res: Response) => {
  try {
    const queryString = req.originalUrl.split("?")[1] || "";
    const targetUrl = `https://api.gusto-demo.com${req.path}${
      queryString ? `?${queryString}` : ""
    }`;

    const accessToken = await tokenManager.getAccessToken();

    // Forward the SDK's headers (Accept, Content-Type, X-Gusto-API-Version, etc.)
    // and only add what the browser can't supply itself.
    const headers = forwardableHeaders(
      new Headers(req.headers as Record<string, string>)
    );
    headers.set("authorization", `Bearer ${accessToken}`);
    headers.set("x-gusto-client-ip", req.ip ?? "");

    // Forward the raw body verbatim. express.raw() gives a Buffer when there's a
    // body and an empty object otherwise, so bodyless requests (the calculate /
    // submit PUTs) simply carry no body.
    const body =
      Buffer.isBuffer(req.body) && req.body.length > 0 ? req.body : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body as BodyInit | undefined,
    });

    // Relay the API response: status, headers, and body stream.
    res.status(response.status);
    forwardableHeaders(response.headers).forEach((value, key) => {
      res.setHeader(key, value);
    });
    if (response.body) {
      Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]).pipe(res);
    } else {
      res.end();
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
