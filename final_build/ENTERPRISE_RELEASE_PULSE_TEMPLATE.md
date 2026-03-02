# Enterprise Release Pulse Template — NEWGAME

## Release window
- Date:
- Branch:
- Commit:
- Release owner:
- Reviewer:
- Deployment target:
  - GitHub Pages

## Pulse status
- Pulse phase: [ ] Pre-release [ ] In-release [ ] Post-release
- Environment: [ ] Local [ ] Staging [ ] Production

## Pre-release controls
- [ ] `CURRENT_GAPS.txt` reviewed and no unexpected blockers.
- [ ] Contract surface checklist completed (`REPOSITORY_INTERFACE_CONTRACTS.txt`).
- [ ] Required docs up-to-date:
  - `BUILD_MAP.txt`
  - `COMPONENT_INDEX.txt`
  - affected `COMPONENT__*.txt`
- [ ] `INDEX_LINK_VERIFICATION.md` check passed.
- [ ] `SECURITY_AND_RELIABILITY_ASSERTIONS.txt` reviewed against changed scope.
- [ ] Smoke flow prepared in `ENTERPRISE_TEST_MATRIX.md`.

## Release actions
- [ ] Commit created with scoped change list.
- [ ] Push executed to `main`.
- [ ] Pages workflow completed.
- [ ] Public URL validated.
- [ ] Post-deploy screenshot set captured.

## Live verification
- [ ] Title→hub flow validated.
- [ ] Hub→mission flow validated.
- [ ] Mission→battle flow validated.
- [ ] Result flow validated.
- [ ] API exposure confirmed (`render_game_to_text`, `advanceTime`).
- [ ] No critical console errors in first 5 minutes.

## Risk & mitigation
- P0 risk observed:
  - [ ] None
  - [ ] Documented with mitigant:
- [ ] rollback readiness confirmed.
- [ ] incident triage contact confirmed.

## Post-release closeout
- [ ] `LINEAGE_AND_CHANGE_LOG.md` appended.
- [ ] `GAP_CLOSE_LOG.md` appended for any closed item.
- [ ] `DOC_COVERAGE_AUDIT.md` reviewed.
- [ ] 24-hour follow-up pass completed.

## Pulse result
- Outcome: [ ] Pass [ ] Conditional [ ] Fail
- Notes:
- Next action:
