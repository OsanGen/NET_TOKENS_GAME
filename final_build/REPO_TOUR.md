# New Game Repository Tour (10-minute onboarding)

Goal
- Onboard a maintainer in ~10 minutes to full architecture, controls, and operating rules.

Minute 1 — Big picture
- Open `final_build/BUILD_MAP.txt` and scan system classification + entrypoints.
- Confirm module boundaries and flow narrative.

Minute 2 — Live architecture
- Open `final_build/ARCHITECTURE_DATA_FLOW.txt`.
- Review event streams and mode transitions.

Minute 3 — Ownership map
- Open `final_build/COMPONENT_INDEX.txt`.
- Open `final_build/COMPONENT_DEPENDENCY_DAG.txt`.
- Open one impacted component spec (`COMPONENT__Core_Runtime.txt`).

Minute 4 — Runtime/API contracts
- Open `final_build/REPOSITORY_INTERFACE_CONTRACTS.txt`.
- Open `index.html`, `styles.css`, `game.js` and confirm required selectors/API names.

Minute 5 — Controls and UI behavior
- Open `final_build/COMPONENT__Controls_Overlay.txt`.
- Open `final_build/SEQUENCED_RUNBOOK.txt` and `final_build/FILE_TO_FEATURE_MATRIX.txt`.

Minute 6 — Gameplay and visuals
- Open `COMPONENT__Combat_Loop.txt` and `COMPONENT__Visual_Post_Process.txt`.
- Re-open `game.js` only around combat and rendering entrypoints if needed.

Minute 7 — Operations and deployment
- Open `final_build/SEQUENCED_RUNBOOK.txt`.
- Open `.github/workflows/deploy-pages.yml`.
- Open `final_build/DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md`.

Minute 8 — Testing posture
- Open `final_build/ENTERPRISE_TEST_MATRIX.md`.
- Open `web_game_playwright_client_local.js`.
- Confirm Playwright dependency in `package.json`.

Minute 9 — Risk and quality gates
- Open `final_build/TECH_DEBT_LOG.md`.
- Open `final_build/CHANGE_RISK_MATRIX.csv`.
- Open `final_build/SECURITY_AND_RELIABILITY_ASSERTIONS.txt`.

Minute 10 — Maintenance discipline
- Open `final_build/CURRENT_GAPS.txt`.
- Open `final_build/GAP_CLOSE_LOG.md`.
- Open `final_build/ENTERPRISE_OPERATING_PROC.md`.

Suggested practical first task
- Run one full flow check:
  - title -> hub -> mission -> battle -> result
- Validate output in `render_game_to_text()` and confirm no UI selector drift.

Completion check
- If all 10 sections are reviewed and no unresolved blockers are found, handoff is complete.
- If blockers are found, log them in `CURRENT_GAPS.txt` with concrete next action.
