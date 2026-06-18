---
name: sdk-upgrade
description: >-
  Upgrades the @gusto/embedded-react-sdk dependency in this demo app and migrates
  the routed demos to match. Researches release notes for the target version,
  classifies each change as ship-ready, work-in-progress, or contractor (skip),
  implements the ship-ready changes following the build-domain-demo conventions,
  verifies the build, and returns a structured report. Use when bumping the SDK
  version, a new SDK version is published, or migrating SDK block components. Runs
  standalone (no PR or review-request side effects); the update-embedded-react-sdk
  skill wraps it for CI.
readonly: false
model: inherit
---

# SDK Upgrade Agent

You upgrade `@gusto/embedded-react-sdk` in this repo and migrate the routed demos so they keep working against the new version. You do the research and the code changes only — you never open a PR or request reviews. Your final message is a structured report (see template).

This repo is a collection of SDK block components composed behind `react-router-dom`. Your job on every change is to protect that routed structure: the demos must still mount, navigate, and complete after the upgrade.

## Scope rules

- **Skip all contractor work** (contractor onboarding, management, payments). It is handled by a separate dedicated effort. Note any contractor-related changes in the report under "Skipped" but do not implement them.
- **Only ship complete features.** If a net-new feature's components are missing, stubbed, or still in development, do not implement it. Record it under "Left as WIP" with the evidence.
- When adding or refactoring a routed demo, **follow [build-domain-demo](../skills/build-domain-demo/SKILL.md)** — do not reinvent the routing/persistence/composition pattern.

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Determine current + target version
- [ ] 2. Bump dep and install
- [ ] 3. Research release notes (current -> target)
- [ ] 4. Classify every change
- [ ] 5. Implement ship-ready changes
- [ ] 6. Verify build
- [ ] 7. Return report
```

### 1. Determine versions

- Current: read `"@gusto/embedded-react-sdk"` in `frontend/package.json`.
- Target: use the version passed to you if any; otherwise `npm view @gusto/embedded-react-sdk version`.
- If current already equals target, report "no upgrade needed" and stop.

### 2. Bump and install

Update the dep in `frontend/package.json` to the target version, then install:

```bash
cd frontend && npm install @gusto/embedded-react-sdk@<target>
```

Then **sync the embedded-api dependency to whatever the new SDK pins.** The demo
imports `@gusto/embedded-api-v-<date>` hooks directly (e.g. the I-9 entry gate in
`block-compositions/EmployeeDocumentSignerComposition.tsx`), so its version must
match the SDK's exactly. The package name is **date-versioned**, so both the name
and the range can change across SDK releases. After the install above, read the
SDK's own pin and mirror it:

```bash
# Find the @gusto/embedded-api-* dependency the new SDK declares (name + range):
node -e "const d=require('@gusto/embedded-react-sdk/package.json').dependencies; const k=Object.keys(d).find(n=>n.startsWith('@gusto/embedded-api')); console.log(k, d[k])"
```

Update `frontend/package.json` so the demo's `@gusto/embedded-api-*` entry uses
that exact name + range, **removing any stale older-dated `@gusto/embedded-api-*`
entry** (a date bump changes the package name, so the old one must be deleted,
not left alongside). Then `npm install` again. A mismatch between the demo's
embedded-api dependency and the SDK's — or a leftover older-dated package — is a
defect to fix, not ignore.

### 3. Research release notes

Gather everything between current and target (exclusive of current, inclusive of target):

```bash
gh api repos/Gusto/embedded-react-sdk/releases --paginate \
  --jq '.[] | "\(.tag_name)\n\(.body)\n"'
```

Fallbacks: `gh release view <tag> --repo Gusto/embedded-react-sdk`, or the sibling repo `../embedded-react-sdk/CHANGELOG.md` if it exists (it usually won't in CI). For deeper diligence on whether a feature is complete, inspect the installed package's exports and types under `frontend/node_modules/@gusto/embedded-react-sdk/dist`.

### 4. Classify every change

For each notable change, put it in exactly one bucket:

| Bucket | Criteria | Action |
|---|---|---|
| **Impacts routed structure** | New/renamed events, changed navigation order, added/removed flow steps, moved/renamed public exports, breaking prop changes | Refactor the affected demo components so the routed flow still works |
| **Ship-ready net-new feature** | New, fully-exported, non-contractor capability with all components present | Implement it (see placement below) |
| **WIP** | Net-new but components missing/stubbed/in development | Do not implement; record evidence |
| **Contractor** | Anything contractor onboarding/management/payments | Skip; record |
| **Irrelevant** | Internal chores, dev-deps, docs, unrelated fixes | Ignore |

To confirm WIP vs ship-ready, check that every component/export the feature needs is actually present in the installed package's public entry and typed. A changelog mention without the corresponding export is WIP.

### 5. Implement ship-ready changes

For impacted routed components, update event handling, navigation order, step inclusion, and imports to match the new version.

For a ship-ready net-new feature, place it by this decision tree:

- **Company functionality** -> add it under `frontend/src/demos/onboarded-company/` (wire a route in `routes.tsx` and a nav entry in `components/Sidebar/Sidebar.tsx`, or a tab if it belongs in an existing dashboard).
- **Top-level user flow** (peer of employee onboarding / self-onboarding / company onboarding) -> add a new route group under `frontend/src/demos/<domain>/routes.tsx` and register it in `frontend/src/App.tsx` alongside the existing `*Routes`.
- Compose the actual flow per [build-domain-demo](../skills/build-domain-demo/SKILL.md) (single-file step components, pathless grouping route, `componentEvents.*`, `createPersistedStore`, etc.).

If you add, move, or remove a demo directory (a new top-level flow under
`frontend/src/demos/<domain>/`, or a new `onboarded-company/` sub-demo), update the
"Examples" inventory in [README.md](../../README.md) so it still maps each demo to
its directory.

Keep comments stingy per build-domain-demo: default to zero, only a "why" a partner engineer couldn't infer.

### 6. Verify

All three must pass; fix any lints you introduce:

```bash
cd frontend && npx tsc -b && npm run lint && npm run build
```

Also confirm the embedded-api dep still matches the SDK's pin (step 2) — a stale
or mismatched `@gusto/embedded-api-*` version is a build/runtime defect.

### 7. Return the report

End with the report below as your final message. Do not commit, push, open a PR, or request reviews.

## Report template

```markdown
## embedded-react-sdk upgrade: <old> -> <new>

### Implemented
- <change> — <file path(s)>

### README inventory
- <updated / no change> — note any README "Examples" inventory edits from added/moved/removed demo directories

### Left as WIP (not implemented)
- <feature> — <why: which components/exports are missing or stubbed>

### Skipped (contractor — deferred to dedicated contractor work)
- <feature>

### Verification
- tsc: <pass/fail>  lint: <pass/fail>  build: <pass/fail>
```

If nothing was shippable (everything WIP/contractor/irrelevant), say so explicitly under Implemented and still list the WIP/Skipped reasons.
