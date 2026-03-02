# Master Spec Index — NEWGAME

Purpose
- Single markdown navigator for maintainers and enterprise review.

Core runtime
- `game.js` — authoritative simulation, mode transitions, API surface.
- `index.html` — shell and DOM surfaces for rendering + controls.
- `styles.css` — visual system and responsive contracts.

Tooling and deployment
- `scripts/open-game.sh` — local start orchestration.
- `scripts/stop-game.sh` — local stop + process cleanup.
- `scripts/generate-imagegen-assets.sh` — optional asset regeneration flow.
- `web_game_playwright_client_local.js` — automation client for flow validation.
- `.github/workflows/deploy-pages.yml` — static deployment pipeline.

State and architecture references
- `final_build/BUILD_MAP.txt` — high-level architecture and dependency view.
- `final_build/ARCHITECTURE_DATA_FLOW.txt` — event and state schema.
- `final_build/COMPONENT_DEPENDENCY_DAG.txt` — module and file dependencies.
- `final_build/COMPONENT_INDEX.txt` — component ownership matrix.
- `final_build/COMPONENT__Core_Runtime.txt` — core runtime responsibilities.
- `final_build/COMPONENT__Controls_Overlay.txt` — UI sync and controls ownership.
- `final_build/COMPONENT__Visual_Post_Process.txt` — effect stack ownership.
- `final_build/CURRENT_GAPS.txt` — live unresolved work items.

Risk and readiness
- `final_build/TECH_DEBT_LOG.md` — prioritized debt.
- `final_build/CHANGE_RISK_MATRIX.csv` — operational/software risk map.
- `final_build/ENTERPRISE_READINESS_SCORECARD.md` — overall readiness score.
- `final_build/SECURITY_AND_RELIABILITY_ASSERTIONS.txt` — hardening posture.

Process and governance
- `final_build/SEQUENCED_RUNBOOK.txt` — local/QA/deploy flow.
- `final_build/DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md` — release + rollback.
- `final_build/ENTERPRISE_OPERATING_PROC.md` — operating rules and escalation.
- `final_build/ARCHIVAL_ROLLUP_CHECKLIST.md` — release archival checklist.
- `final_build/ENTERPRISE_HANDFOFF_PACKAGE.txt` — takeover guidance.
- `final_build/ENTERPRISE_QUICK_TAKEOVER_CARD.md` — one-page maintainer handoff snapshot.

Documentation ecosystem
- `final_build/FILE_TO_FEATURE_MATRIX.txt` — file-feature mapping.
- `final_build/LINEAGE_AND_CHANGE_LOG.md` — milestone history.
- `final_build/GAP_CLOSE_LOG.md` — closure evidence.
- `final_build/FINAL_BUILD_MANIFEST.json` — machine inventory of docs and owners.
- `final_build/API_CHANGE_REQUEST_TEMPLATE.txt` — API change control.
- `final_build/CODEPATH_DIAGRAMS.md` — sequence/path diagrams.
- `final_build/GLOSSARY_TO_COMPONENT_LINKS.md` — glossary-to-code map.
- `final_build/COMPLETE_GLOSSARY.txt` — canonical terminology.
- `final_build/CODEX_DEPENDENCY_EXPORT.yaml` — machine graph export.
- `final_build/ARCHITECTURE_METRICS_TEMPLATE.json` — structured metrics template.
- `final_build/RELEASE_ACCEPTANCE_DASHBOARD.md` — release acceptance gates.
- `final_build/MAINTENANCE_ROADMAP_ISSUES_FIRST.md` — issue-first roadmap.
- `final_build/SCALING_AND_PERFORMANCE_BUDGET.md` — perf/scaling policy.
- `final_build/ENTERPRISE_TEST_MATRIX.md` — test matrix.
- `final_build/REPOSITORY_INTERFACE_CONTRACTS.txt` — stable runtime/UI/API contracts.
- `final_build/EXTERNAL_DEPENDENCIES_MATRIX.txt` — external/platform dependencies.
- `final_build/INDEX_LINK_VERIFICATION.md` — link integrity and discoverability checks.
- `final_build/REPO_TOUR.md` — 10-minute maintainer onboarding walk.
- `final_build/DOC_COVERAGE_AUDIT.md` — coverage completeness checks.
- `final_build/MASTER_SPEC_INDEX.csv` — machine-readable doc map.
- `final_build/ENTERPRISE_RELEASE_PULSE_TEMPLATE.md` — release gates snapshot format.
- `final_build/ONE_COMMAND_DOC_AUDIT.sh` — one-shot required-doc audit script.
- `final_build/MISSING_DOC_ALERTS.md` — recorded missing-doc outcomes.
- `final_build/DOC_DEPRECATION_INDEX.md` — canonical map of deprecated docs.
- `final_build/GENERATE_DOC_DASHBOARD.js` — script to generate a current docs dashboard.

Suggested reading order
- `BUILD_MAP.txt`
- `ARCHITECTURE_DATA_FLOW.txt`
- `COMPONENT_INDEX.txt`
- `CURRENT_GAPS.txt`
- `REPOSITORY_INTERFACE_CONTRACTS.txt`
- `SEQUENCED_RUNBOOK.txt`

Acceptance
- This index is complete when every major file listed here appears in at least one component spec or runbook reference.
