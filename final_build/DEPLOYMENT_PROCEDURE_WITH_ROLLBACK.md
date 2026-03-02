# Deployment Procedure With Rollback — NEWGAME

## Scope
Define a predictable ship-and-rollback sequence for `main` branch static releases.

## Standard deployment
1. Finalize code changes and ensure docs are updated.
2. Verify the change scope:
   - source files updated intentionally
   - `final_build/CURRENT_GAPS.txt` updated with current status
3. Commit changes with a concise commit message.
4. Push to `main`.
5. Confirm GitHub Pages workflow run completes:
   - artifact uploaded
   - site is published
6. Validate live URL manually:
   - load page
   - run quick flow check in desktop and compact width
   - ensure `F/V/P/H` and action rail still function

## Validation smoke criteria before unfreezing release
- Title loads and transitions to hub.
- Mission path renders HUD and objective text.
- One battle interaction produces effects and returns correctly.
- No layout overflow on action/control rail.
- Browser console does not throw fatal errors during smoke.

## Pre-rollback checkpoints
If a defect is detected after publish, identify:
- root cause class: gameplay, visual, tooling, deployment, or asset.
- affected user impact level: blocking, severe, cosmetic.

## Rollback procedure (fast)
1. Identify last good commit hash.
2. Open repository and create corrective commit:
   - revert the breaking commit, **or**
   - apply targeted fix commit.
3. Push corrective commit to `main`.
4. Re-run workflow wait window until new deploy finishes.
5. Re-validate critical smoke steps.

## Emergency rollback (no new commit)
1. If immediate revert required, checkout known-good commit and perform new patch-rollback commit.
2. Push immediately to `main`.
3. Revert once root-cause fix is prepared.

## Post-rollback hygiene
- Update `final_build/CURRENT_GAPS.txt` with rollback reason and follow-up action.
- Add changelog note in relevant component docs if behavior changed.
- Keep rollout artifact references for audit.

## Deployment ownership
- Release owner: changeset author
- QA owner: whoever runs smoke validation
- Documentation owner: update `final_build/BUILD_MAP.txt` and affected components

## Escalation
- If Pages deploy succeeds but runtime is broken:
  - check asset set and DOM/API contracts first
  - revert if errors are blocking and no immediate fix exists
