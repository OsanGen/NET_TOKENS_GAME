# Technical Debt Log — NEWGAME

This log tracks high-impact debt currently blocking long-term scaling, maintenance velocity, and enterprise readiness.

## 1. Gameplay + rendering monolith in `game.js`
- Severity: High
- Location: `game.js`
- Impact:
  - Cross-cutting concerns mixed in one file (state, render, UI sync, VFX, controls).
  - Increases merge risk and slows refactors.
- Risk:
  - Small visual edits can silently affect combat logic due to proximity.
- Remediation:
  - Split rendering into `renderer.js` module boundary.
  - Keep only integration glue in `game.js`.
- Proposed effort: 2 sprints

## 2. Tight DOM contract coupling
- Severity: High
- Location: `game.js` ↔ `index.html` ↔ `styles.css`
- Impact:
  - ID/class rename breaks HUD sync and automation instantly.
- Risk:
  - Frequent UI redesign regression.
- Remediation:
  - Introduce `ui-bindings.js` constants + selector registry.
  - Add startup selector assertions.
- Proposed effort: 1 sprint

## 3. No automated contract tests
- Severity: Medium
- Location: Validation layer
- Impact:
  - Playwright checks are manual or ad-hoc, no explicit regression assertions for selector/API contract.
- Risk:
  - Silent breakage during refactors.
- Remediation:
  - Add Playwright smoke test suite with fixed assertions on:
    - required selectors
    - flow integrity title→hub→mission→battle→result
    - API call availability
- Proposed effort: 1 sprint

## 4. Visual/asset scale hardening gap
- Severity: Medium
- Location: `game.js` render scale logic + `assets/*`
- Impact:
  - Pixel density and canvas upscale behavior still require manual balancing after asset changes.
- Risk:
  - Perceived resolution defects across displays.
- Remediation:
  - Parameterize render scale policy by viewport buckets and DPI.
  - Add asset dimension guard checks with fallback metrics.
- Proposed effort: 1 sprint

## 5. No structured logging
- Severity: Medium
- Location: Runtime diagnostics
- Impact:
  - Debugging depends on ad-hoc console reads.
- Risk:
  - Slow incident resolution in deployment issues.
- Remediation:
  - Add structured `debugEvent` collector with sampled log buckets.
- Proposed effort: 2 sprints

## 6. Single-source deployment pipeline with no artifact diff check
- Severity: Medium
- Location: `.github/workflows/deploy-pages.yml`
- Impact:
- no artifact integrity diff checks before publish.
- Risk:
  - Missing file regressions can ship to Pages silently.
- Remediation:
  - Add pre-deploy existence checks for mandatory files.
- Proposed effort: 1 sprint

## 7. Documentation drift risk
- Severity: Low
- Location: `final_build/*.txt`
- Impact:
  - Docs can lag behind implementation quickly.
- Risk:
  - New maintainer confusion and incorrect onboarding.
- Remediation:
  - Enforce doc updates in post-change checklist.
- Proposed effort: Ongoing

## Debt priorities
- Immediate: #1, #2, #4, #3.
- Next: #6.
- Stabilization: #5, #7.

## Debt closure policy
- Any debt item closed must:
  - include file-level owner update in `CURRENT_GAPS.txt` and relevant component docs
  - include acceptance check evidence (manual or automated)
