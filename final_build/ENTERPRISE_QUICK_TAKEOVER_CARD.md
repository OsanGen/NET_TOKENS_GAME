# Enterprise Quick Takeover Card — NEWGAME

Project snapshot
- Type: Browser-only game runtime with static deployment
- Main runtime: `game.js` (single-file engine)
- Primary repo stack: HTML/CSS/JS + GitHub Pages

Immediate context
- Visual direction has been overhauled for modern presentation while preserving gameplay logic.
- No backend/API dependencies beyond local static hosting and Playwright tooling.

Where things stand
- Contract and architecture docs fully expanded in `final_build/`.
- Current high-risk area: gameplay-UI coupling and dependency on DOM selectors.
- Current high-priority gap: formalized automated selector/API regression checks.

Fast startup checklist (first 60 minutes)
- Open `final_build/ORGANIZATION_OVERVIEW_MASTER.txt`
- Open `final_build/BUILD_MAP.txt`
- Open `final_build/REPOSITORY_INTERFACE_CONTRACTS.txt`
- Open `current_gaps` equivalent: `final_build/CURRENT_GAPS.txt`
- Run one smoke flow: title→hub→mission→battle→result

Key files to avoid breaking
- `game.js`
- `index.html`
- `styles.css`
- `final_build/CURRENT_GAPS.txt`
- `.github/workflows/deploy-pages.yml`

Go-to docs by task
- Architecture question: `final_build/ARCHITECTURE_DATA_FLOW.txt`
- Deployment issue: `final_build/DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md`
- Regression concern: `final_build/ENTERPRISE_TEST_MATRIX.md`
- Stability/regression planning: `final_build/TECH_DEBT_LOG.md`
- Onboarding/training: `final_build/REPO_TOUR.md`

Decision rule
- If uncertain: do not change gameplay behavior; isolate changes to UI/presentation and validate API contracts.

Current compliance posture
- Docs-driven process active.
- Release gates documented.
- Rollback and archival instructions present.
