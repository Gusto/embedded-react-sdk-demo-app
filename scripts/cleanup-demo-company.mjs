#!/usr/bin/env node
// Best-effort cleanup for the Cloud Agent / CI demo company.
//
// Gusto has no delete-company endpoint, so the closest decommission is to
// SUSPEND the company (it can no longer run payroll). Suspending requires the
// company token, which only the agent that created the company holds -- so this
// must run from the same environment that ran setup-demo-company.mjs (it reads
// backend/tokens.json + scripts/.demo-company.json).
//
// Usage:  CLIENT_ID=... CLIENT_SECRET=... node scripts/cleanup-demo-company.mjs

import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { client, refreshCompanyToken, TOKENS_FILE, RECORD_FILE, log } from "./gusto-demo-lib.mjs";

async function main() {
  if (!existsSync(RECORD_FILE) || !existsSync(TOKENS_FILE)) {
    log("nothing to clean up (no recorded demo company).");
    return;
  }
  const record = JSON.parse(readFileSync(RECORD_FILE, "utf8"));
  const tokens = JSON.parse(readFileSync(TOKENS_FILE, "utf8"));
  if (!record.company_uuid || !tokens.refresh_token) {
    log("nothing to clean up (incomplete records).");
    return;
  }

  const { accessToken, refreshToken } = await refreshCompanyToken(tokens.refresh_token);
  writeFileSync(TOKENS_FILE, JSON.stringify({ refresh_token: refreshToken }, null, 2) + "\n");
  const api = client(accessToken);

  log(`suspending company ${record.company_uuid} (${record.name || "unknown"})`);
  await api(`/v1/companies/${record.company_uuid}/suspensions`, {
    method: "POST",
    body: { reason: "shutting_down", effective_date: new Date().toISOString().slice(0, 10) },
  });

  rmSync(RECORD_FILE, { force: true });
  log("suspended and cleared local record.");
}

main().catch((err) => {
  console.error(`[gusto-demo] cleanup FAILED: ${err.message}`);
  process.exit(1);
});
