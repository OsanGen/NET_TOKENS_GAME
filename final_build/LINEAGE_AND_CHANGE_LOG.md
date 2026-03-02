# Lineage and Change Log — NEWGAME

Scope
- Record meaningful evolution milestones for architecture, visual system, and operational posture.

Method
- Every impactful change is logged with:
  - date
  - area
  - risk class
  - migration impact
  - acceptance impact

2026-02-28 (Current cycle)
- Architecture and docs expansion
  - Area: governance and handoff documentation
  - Change:
    - expanded `final_build/BUILD_MAP.txt` into complete architecture/flow/reference form
    - added dedicated architecture data flow, dependency matrices, path diagrams, and test/risk docs
  - Risk class: Low
  - Migration impact: none
  - Acceptance impact: stronger onboarding and maintenance readiness

2026-02-27
- Visual system stabilization and controls cleanup
  - Area: UI/UX + visuals
  - Change:
    - removed legacy noisy status/foot strips from DOM and CSS
    - synchronized final build component docs with these deletions
  - Risk class: Medium
  - Migration impact: removed non-functional decorative elements
  - Acceptance impact: cleaner layout and reduced clutter

2026-02-26
- Gameplay-safe visual upgrades
  - Area: combat visuals + rendering
  - Change:
    - battle strike visual pass enhancements and tuning in `game.js`
    - HUD and mode sync behavior hardened with reduced-motion-safe controls
  - Risk class: Medium
  - Migration impact: visuals only
  - Acceptance impact: stronger hit/readability feedback

2026-02-25
- Core refactor and noise reduction groundwork
  - Area: architecture and runtime simplification
  - Change:
    - dead code removal in runtime internals
    - improved mode/action rail separation
  - Risk class: Medium
  - Migration impact: reduced runtime complexity in touched areas
  - Acceptance impact: easier mode-specific QA

Template for future log entries
- `[YYYY-MM-DD] [Module] [Type]`
- Example:
  - `2026-03-XX | Combat VFX | Visual`
  - `impact: [X]`
  - `evidence: [flow/screenshot/commit id]`

Commit-to-document mapping rules
- Code commit touching gameplay logic:
  - must update `BUILD_MAP.txt` + relevant `COMPONENT__*.txt`
- Code commit touching UI:
  - must update `COMPONENT__Controls_Overlay.txt` and map entries in `FILE_TO_FEATURE_MATRIX.txt`
- Process/deployment commit:
  - must update `DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md` and `CURRENT_GAPS.txt` if flow changed

Cross-reference
- `final_build/ARCHIVE_ROLLUP_CHECKLIST` must be checked before major milestone closure.
- `CURRENT_GAPS.txt` should show no completed-but-undocumented items.

