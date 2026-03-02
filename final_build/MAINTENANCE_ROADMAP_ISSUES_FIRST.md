# Maintenance Roadmap — Issue First

Guiding rule
- Resolve blockers in this order:
  - contract stability
  - correctness
  - maintainability
  - polish/perf improvements

Phase 1 — Stabilization (1–2 sprints)
1. Contract stabilization
- Close DOM contract drift risk by introducing centralized selector mapping.
- Add runtime startup assertions for required nodes.
- Add optional API shape checks for `render_game_to_text`.
2. Gameplay confidence
- Ensure deterministic behavior around mode transitions and edge conditions.
- Verify no gameplay drift after each visual or UI change.
3. Deployment robustness
- Add mandatory pre-deploy artifact checks.
- Keep rollback steps pre-approved in CI notes.

Phase 2 — Decoupling (2–4 sprints)
1. Runtime modularization
- Extract UI sync layer and visual post-process into distinct modules.
- Keep `game.js` as simulation orchestrator.
2. Data and state hygiene
- Add explicit typed-like state object boundaries (docs first, then enforcement).
3. Automation
- Expand Playwright smoke into deterministic assertion matrix.

Phase 3 — Scale + refine (ongoing)
1. Visual scaling pipeline
- Tune scale policy for DPI and viewport bucketed output.
- Reduce render artifacts on high-resolution displays.
2. Debt reduction
- Reduce large monolithic function blocks.
- Introduce helper functions for repeated branch transitions.
3. Performance controls
- Add frame budget checks (best-effort and lightweight).

Issue-first backlog snapshot
- High
  1) Selector contract coupling (high breakage risk)
  2) Missing structured validation checks for required UI/API nodes
  3) Battle VFX regressions under reduced motion
  4) Asset scale mismatch in mission/hub/battle contexts
- Medium
  5) Deployment artifact sanity checks
  6) Local launch idempotency polish
  7) Structured logging/debug breadcrumbs
- Low
  8) Documentation lag and stale notes

Owner assignment
- Each issue is tagged to file/component owner:
  - `game.js` owner: core logic + state transitions
  - `styles.css` + `index.html` owner: layout and readability
  - `.github/workflows/deploy-pages.yml` owner: release safety
  - `final_build/*` owner: architecture integrity and handoff quality

Definition of ready
- Issue has:
  - clear acceptance checks
  - one failure mode
  - one regression check
  - doc impact checklist

Definition of done
- Code complete and documented.
- Smoke and visual checks pass.
- `CURRENT_GAPS.txt` updated with new status.
