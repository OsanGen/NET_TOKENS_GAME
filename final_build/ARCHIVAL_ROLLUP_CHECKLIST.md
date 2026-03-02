# Archival Rollup Checklist — NEWGAME

Purpose
- Ensure no critical implementation knowledge, contracts, or validation evidence is lost before major releases/refactors.

Pre-rollup
- Confirm `CURRENT_GAPS.txt` is current and all resolved items include next action or close evidence.
- Confirm `BUILD_MAP.txt` and `ORGANIZATION_OVERVIEW_MASTER.txt` reflect latest architecture.
- Confirm `ARCHITECTURE_DATA_FLOW.txt` and component docs are consistent with recent files.
- Confirm deployment path and workflows include required static artifacts.

Required evidence artifacts
- At least one screenshot or proof capture for:
  - title mode
  - hub mode
  - mission mode
  - battle mode
  - result mode
- Screenshot or log for reduced-motion/minimal path.
- Final `git log` entry with commit hash list for archival slice.

Data/contract preservation
- Keep these files referenced before archiving:
  - `REPOSITORY_INTERFACE_CONTRACTS.txt`
  - `FILE_TO_FEATURE_MATRIX.txt`
  - `COMPONENT_DEPENDENCY_DAG.txt`
  - `CODEPATH_DIAGRAMS.md`
  - `API_CHANGE_REQUEST_TEMPLATE.txt`

Deployment preservation
- Confirm Pages rollout succeeded.
- Confirm rollback notes still accurate after release.
- Confirm deployment URL points to expected repository site.

Security/operations preservation
- Confirm no secret/token embedded in repo docs/source.
- Confirm local tooling scripts are reproducible.
- Confirm stop/start flow is idempotent.

Handoff package contents
- Architecture docs summary
- Known risks and debt log
- Test matrix and last verification state
- Runbook + rollback instructions
- Change lineage and gap status

Archive command criteria
- Do not archive release notes until:
  - all P0/P1 checks pass
  - major docs updated
  - one maintainer can trace each critical path in 10 minutes using only `final_build/*`

Post-rollup retention
- Keep `final_build/*` uncompressed in git for future audits.
- Keep output snapshots in run history for QA references.
- Preserve this checklist version for next major release.

