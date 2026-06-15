---
name: update-embedded-react-sdk
description: >-
  CI/automation orchestrator that updates the @gusto/embedded-react-sdk dependency
  end to end: runs the sdk-upgrade agent to research the release and migrate the
  routed demos, then opens a ready-for-review (non-draft) pull request with the
  upgrade report as the body and requests review from the @Gusto/embedded-sdk team
  so they are notified via GitHub (drafts suppress that notification).
  Use when a new SDK version is published or when running the SDK update automation.
  For a local upgrade with no PR, run the sdk-upgrade agent directly instead.
disable-model-invocation: true
---

# Update embedded-react-sdk

Thin orchestrator for the CI path. The real work (research + code changes + build
verification) lives in the **sdk-upgrade** agent ([../../agents/sdk-upgrade.md](../../agents/sdk-upgrade.md)).
This skill only adds the side effect CI needs: a reviewable pull request.

It is normally kicked off headless by a CI script when a new version of
`@gusto/embedded-react-sdk` is published. The team is notified through standard
GitHub review-request notifications — no Slack, webhooks, or secrets required. The
`@Gusto/embedded-sdk` team is also auto-requested via [.github/CODEOWNERS](../../../.github/CODEOWNERS),
so the explicit `--reviewer` below is belt-and-suspenders.

**Open the PR ready for review, never as a draft.** This is the whole reason the
notification works. GitHub suppresses CODEOWNERS review requests on draft PRs and
does not email the requested reviewers — code owners are not even auto-requested
until the PR is marked "Ready for review." A draft PR therefore looks fine but
silently fails the one job this skill has (getting the upgrade on the team's
radar). So whatever tool you create the PR with, it must be a ready PR:

- Cursor cloud-agent PR tool (the CI path): pass `draft: false`. It defaults to
  `draft: true`, so you must override it — this is the default that bit us.
- `gh pr create`: it is ready by default; just do not pass `--draft`.

If for any reason a draft slips through, mark it ready (`gh pr ready <url>` or the
PR tool) so the review requests and emails actually fire.

## Workflow

```
- [ ] 1. Run the sdk-upgrade agent, capture its report
- [ ] 2. If changes were made: branch, commit, open PR (report = body) + request review
- [ ] 3. If nothing shippable: do not open a PR; state why in the final summary
```

### 1. Run the upgrade agent

Delegate via the Task tool to the `sdk-upgrade` agent, passing the target version if
CI provided one (otherwise the agent resolves latest from npm). It bumps the dep,
migrates the routed demos, verifies the build, and returns the structured report.

Keep the agent's returned report verbatim — it becomes the PR body.

### 2. Open the PR (only if the agent made changes)

Open it **ready for review, not a draft** (see the intro — a draft PR sends no
review-request notifications). When the cloud-agent PR tool is available, prefer
it and pass `draft: false`. The `gh` equivalent:

```bash
cd frontend && export VERSION=<new-version>
git checkout -b "chore/update-ersdk-$VERSION"
git add -A && git commit -m "chore: update @gusto/embedded-react-sdk to $VERSION"
git push -u origin HEAD
gh pr create \
  --title "chore: update @gusto/embedded-react-sdk to $VERSION" \
  --body "$REPORT" \
  --reviewer Gusto/embedded-sdk
```

Requesting the team as a reviewer on a ready (non-draft) PR sends each member a
GitHub notification + email. CODEOWNERS would request them anyway; passing
`--reviewer` makes it explicit and fails loudly if the team ever loses repo
access. Both the auto-request and the explicit request are no-ops on a draft, so
the ready state is what actually delivers the notification. Report the PR URL in
the final summary.

### 3. No shippable changes

If the agent reports everything was WIP / contractor / irrelevant (no code changes),
do not open a PR. State in the final summary that the release was evaluated and why
nothing shipped (carry over the agent's WIP/Skipped sections), so there's a record.

## Notes

- No secrets required — notification is entirely through GitHub review requests.
- The PR must be **ready for review, not a draft** — GitHub suppresses CODEOWNERS
  review requests and reviewer emails on drafts, so a draft PR notifies no one.
  The cloud-agent PR tool defaults to draft; override it with `draft: false`.
- The `@Gusto/embedded-sdk` team must keep write access to this repo for the
  CODEOWNERS auto-request and `--reviewer` to deliver.
