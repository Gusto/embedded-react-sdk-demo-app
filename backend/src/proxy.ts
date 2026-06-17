import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { Readable } from "node:stream";
import { tokenManager } from "./tokenManager";

dotenv.config();

const GUSTO_API_BASE_URL =
  process.env.GUSTO_API_BASE_URL ?? "https://api.gusto-demo.com";

const PORT = 3001;

// A cross-origin browser fetch can only read custom response headers that the
// server explicitly allow-lists. The SDK reads these pagination headers off the
// fetch response to drive its list pagination controls.
const PAGINATION_HEADERS = [
  "x-total-count",
  "x-total-pages",
  "x-page",
  "x-per-page",
];

// Extra browser origins allowed through CORS, on top of localhost. Comma-separated
// in the ALLOWED_ORIGINS env var. Empty by default.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// This proxy holds your Gusto credentials, so it should not be reachable from
// arbitrary web pages. We keep localhost allowed out of the box for this demo
// (where its frontend runs); set ALLOWED_ORIGINS to add the origins your own app
// is served from, and tighten this to match your security needs. Non-browser
// clients (curl, Postman) send no Origin header and are always allowed.
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    const isAllowed =
      !origin ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      ALLOWED_ORIGINS.includes(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
  exposedHeaders: PAGINATION_HEADERS,
};
app.use(cors(corsOptions));

// Capture the request body as a raw Buffer for any content type, so the SDK's
// exact bytes are forwarded to the API - no JSON parse/re-serialize that could
// alter the payload or invent a body for a bodyless request.
app.use(express.raw({ type: "*/*", limit: "50mb" }));

// Hop-by-hop headers: each connection recomputes these, so forwarding the
// incoming values corrupts the request/response. Dropped in both directions.
const HOP_BY_HOP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "content-encoding",
  "transfer-encoding",
]);

function withoutHopByHopHeaders(source: Headers): Headers {
  const result = new Headers();
  source.forEach((value, name) => {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      result.set(name, value);
    }
  });
  return result;
}

// Map an incoming SDK request onto the matching Gusto API URL.
function buildTargetUrl(req: Request): string {
  const url = new URL(GUSTO_API_BASE_URL);
  // req.path is the parsed path only (never the full/absolute URL), so it can't
  // re-target the host.
  url.pathname = req.path;
  url.search = new URL(req.originalUrl, GUSTO_API_BASE_URL).search;
  return url.toString();
}

// express.raw() gives a Buffer when there's a body and an empty object
// otherwise, so bodyless requests (the calculate / submit PUTs) carry no body.
// We hand fetch a plain Uint8Array (a valid BodyInit) rather than the Buffer,
// whose ArrayBufferLike-backed type fetch doesn't accept even though the bytes
// are identical.
function getRequestBody(req: Request): Uint8Array<ArrayBuffer> | undefined {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return undefined;
  }
  const body = new Uint8Array(req.body.length);
  body.set(req.body);
  return body;
}

// Pipe the API's response body (a web ReadableStream) straight to the client,
// so payloads of any type - JSON, text, or binary PDFs - relay byte-for-byte.
// This is why you can stream document downloads through the proxy unchanged.
function pipeResponseBody(body: ReadableStream, res: Response): void {
  Readable.fromWeb(body as Parameters<typeof Readable.fromWeb>[0]).pipe(res);
}

// Transparent proxy to the Gusto API: forward the SDK's request, inject the
// server-side auth token + client IP, then relay the API's response untouched.
app.all("*", async (req: Request, res: Response) => {
  try {
    const accessToken = await tokenManager.getAccessToken();

    // Forward the SDK's own headers (Accept, Content-Type, X-Gusto-API-Version,
    // etc.) and add only what the browser can't supply itself.
    const headers = withoutHopByHopHeaders(
      new Headers(req.headers as Record<string, string>)
    );
    headers.set("authorization", `Bearer ${accessToken}`);
    headers.set("x-gusto-client-ip", req.ip ?? "");

    const apiResponse = await fetch(buildTargetUrl(req), {
      method: req.method,
      headers,
      body: getRequestBody(req),
    });

    res.status(apiResponse.status);
    withoutHopByHopHeaders(apiResponse.headers).forEach((value, name) => {
      res.setHeader(name, value);
    });

    if (apiResponse.body) {
      pipeResponseBody(apiResponse.body, res);
    } else {
      res.end();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Proxy error:", message);
    res.status(500).json({
      error: "Failed to proxy request to Gusto API",
      details: message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
