# Release Acceptance Dashboard — NEWGAME

Release ID:
- Date:
- Commit:
- Release Owner:
- Reviewer:

Pre-release checks
- [ ] `CURRENT_GAPS.txt` reviewed and only intentional open items remain.
- [ ] `BUILD_MAP.txt` updated for current architecture state.
- [ ] Affected component docs (`COMPONENT__*.txt`) updated.
- [ ] Required contracts validated: `render_game_to_text`, `advanceTime`.
- [ ] UI selectors used by automation validated in markup and runtime sync.

Functional checks
- [ ] Title flow initializes and transitions to hub.
- [ ] Mission flow initializes objectives and supports completion/exit path.
- [ ] Battle flow supports turn/action transition and returns correctly.
- [ ] Result flow re-enters hub.
- [ ] No hard crash in standard key-driven flow.

Visual checks
- [ ] Desktop layout shows full canvas and complete action/control rails.
- [ ] Reduced-motion/minimal mode checked and readable.
- [ ] No overflow/spill on compact width checks.
- [ ] Battle effects are visible but non-blocking.

Operations checks
- [ ] `web_game_playwright_client_local.js` run completes flow.
- [ ] Local launch/stop sequence works (open + stop without stale process).
- [ ] GitHub Pages workflow run completed successfully.
- [ ] Public URL loads with required assets.

Security/reliability checks
- [ ] No unexpected external dependency introduced.
- [ ] No gameplay logic changed by visual-only patch (if claimed visual-only).
- [ ] Artifact path/secret hygiene reviewed.

Documentation checks
- [ ] `LINEAGE_AND_CHANGE_LOG.md` includes this release event.
- [ ] `GAP_CLOSE_LOG.md` includes all closed gaps with evidence.
- [ ] Master index includes all newly added docs.

Go/No-go
- Go: [ ]
- No-go: [ ]
- Blocking issue if no-go:
  - [ ]
- Corrective action:
  - [ ]

Rollback prepared
- [ ] Corrective rollback strategy documented.
- [ ] Re-push/recovery window communicated.
- [ ] Test evidence retained after rollback or redeploy.

Post-release
- [ ] 24-hour follow-up flow smoke on deployed URL.
- [ ] One maintainer review log entry created.
- [ ] New risks appended to `TECH_DEBT_LOG.md` if surfaced.
