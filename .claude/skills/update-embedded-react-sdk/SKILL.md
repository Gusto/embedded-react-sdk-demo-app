---
name: update-embedded-react-sdk
description: >-
  CI/automation orchestrator that updates the @gusto/embedded-react-sdk dependency
  end to end: runs the sdk-upgrade agent to research the release and migrate the
  routed demos, then opens a pull request with the upgrade report as the body and
  requests review from the @Gusto/embedded-sdk team so they are notified via GitHub.
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

Requesting the team as a reviewer sends each member a GitHub notification + email.
CODEOWNERS would request them anyway; passing `--reviewer` makes it explicit and
fails loudly if the team ever loses repo access. Report the PR URL in the final
summary.

### 3. No shippable changes

If the agent reports everything was WIP / contractor / irrelevant (no code changes),
do not open a PR. State in the final summary that the release was evaluated and why
nothing shipped (carry over the agent's WIP/Skipped sections), so there's a record.

## Notes

- No secrets required — notification is entirely through GitHub review requests.
- The `@Gusto/embedded-sdk` team must keep write access to this repo for the
  CODEOWNERS auto-request and `--reviewer` to deliver.
