# Documentation Coverage Audit — NEWGAME

Coverage objective
- Ensure every critical domain has at least one authoritative doc.

Coverage domains
- Architecture: `BUILD_MAP.txt`, `ARCHITECTURE_DATA_FLOW.txt`, `COMPONENT_DEPENDENCY_DAG.txt`, `MASTER_SPEC_INDEX.md`
- Gameplay runtime: `COMPONENT__Core_Runtime.txt`, `COMPONENT__Hub_Flow.txt`, `COMPONENT__Mission_Flow.txt`, `COMPONENT__Combat_Loop.txt`
- Visual system: `COMPONENT__Visual_Post_Process.txt`, `styles.css`, `COMPONENT__Brand_Scene_Engine.txt`
- UI/controls: `COMPONENT__Controls_Overlay.txt`, `COMPONENT_INDEX.txt`
- Tooling: `SEQUENCED_RUNBOOK.txt`, `COMPONENT__Local_Launch_Tooling.txt`, `scripts/open-game.sh`, `scripts/stop-game.sh`
- Deployment/ops: `DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md`, `COMPONENT__Pages_Deployment.txt`
- Test/QA: `ENTERPRISE_TEST_MATRIX.md`, `web_game_playwright_client_local.js`, `web_game_playwright_client_local.js` contract references
- Security/reliability: `SECURITY_AND_RELIABILITY_ASSERTIONS.txt`, `EXTERNAL_DEPENDENCIES_MATRIX.txt`, `TECH_DEBT_LOG.md`
- Governance: `CURRENT_GAPS.txt`, `GAP_CLOSE_LOG.md`, `ARCHIVAL_ROLLUP_CHECKLIST.md`
- Handoff: `ORGANIZATION_OVERVIEW_MASTER.txt`, `REPO_TOUR.md`, `ENTERPRISE_HANDFOFF_PACKAGE.txt`, `LINEAGE_AND_CHANGE_LOG.md`

Required docs for release
- Pre-release required
  - `BUILD_MAP.txt`
  - `REPOSITORY_INTERFACE_CONTRACTS.txt`
  - `CURRENT_GAPS.txt`
  - `SEQUENCED_RUNBOOK.txt`
  - `DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md`
  - `COMPONENT__Core_Runtime.txt`
  - `COMPONENT__Controls_Overlay.txt`
  - `ENTERPRISE_TEST_MATRIX.md`

Coverage gaps to watch
- Duplicate ownership docs for one topic should consolidate or cross-link clearly.
- Any new component should add:
  - one component spec
- any new acceptance path should update:
  - `FILE_TO_FEATURE_MATRIX.txt`
  - one runbook or test matrix entry

Monthly audit cadence
- review this document and confirm every required doc set still exists and is current.
- if stale, escalate as a `CURRENT_GAPS.txt` item.

Pass criteria
- no required doc category missing
- at least one link from governance docs to each domain doc set
- no missing link in `ORGANIZATION_OVERVIEW_MASTER.txt`
