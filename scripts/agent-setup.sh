#!/usr/bin/env bash
# agent-setup: deterministic, idempotent bootstrap for Cursor cloud agents / CI.
#
# This is NOT the normal local-dev setup. Humans running the demo on their own
# machine should follow README.md (hand-fill backend/.env + backend/tokens.json,
# then `npm install` + `npm run dev` per service). This script is intentionally
# named `agent-setup` so it is obviously the automated path and won't be mistaken
# for the normal run instructions.
#
# What it does, unconditionally, every time it runs:
#   1. Installs backend + frontend dependencies.
#   2. Provisions / reuses an approved Gusto demo company and wires it into the
#      app (scripts/setup-demo-company.mjs).
#
# Both steps are idempotent: re-running reuses installed deps and the recorded
# demo company instead of redoing work, so it is always safe to run first.
#
# Requirements: CLIENT_ID and CLIENT_SECRET in the environment (Cursor Secrets).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

log() { printf '\n[agent-setup] %s\n' "$1"; }

if [[ -z "${CLIENT_ID:-}" || -z "${CLIENT_SECRET:-}" ]]; then
  echo "[agent-setup] ERROR: CLIENT_ID and CLIENT_SECRET must be set (Cursor Secrets panel)." >&2
  echo "[agent-setup] These are the only durable inputs needed to provision a demo company." >&2
  exit 1
fi

log "installing backend dependencies"
npm install --prefix backend

log "installing frontend dependencies"
npm install --prefix frontend

log "provisioning / reusing Gusto demo company"
node scripts/setup-demo-company.mjs

log "done. Start the dev servers with:"
echo "    npm run dev --prefix backend    # http://localhost:3001"
echo "    npm run dev --prefix frontend   # http://localhost:3002"
