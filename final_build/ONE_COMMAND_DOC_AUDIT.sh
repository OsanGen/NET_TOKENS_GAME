#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/Users/abelsanchez/CODEX/NEWGAME/final_build"

required_files=(
  "BUILD_MAP.txt"
  "ARCHITECTURE_DATA_FLOW.txt"
  "COMPONENT_INDEX.txt"
  "COMPONENT_DEPENDENCY_DAG.txt"
  "REPOSITORY_INTERFACE_CONTRACTS.txt"
  "FILE_TO_FEATURE_MATRIX.txt"
  "SEQUENCED_RUNBOOK.txt"
  "DEPLOYMENT_PROCEDURE_WITH_ROLLBACK.md"
  "SECURITY_AND_RELIABILITY_ASSERTIONS.txt"
  "EXTERNAL_DEPENDENCIES_MATRIX.txt"
  "TECH_DEBT_LOG.md"
  "CODEPATH_DIAGRAMS.md"
  "MAINTENANCE_ROADMAP_ISSUES_FIRST.md"
  "SCALING_AND_PERFORMANCE_BUDGET.md"
  "ENTERPRISE_TEST_MATRIX.md"
  "LINEAGE_AND_CHANGE_LOG.md"
  "GAP_CLOSE_LOG.md"
  "ARCHIVAL_ROLLUP_CHECKLIST.md"
  "MASTER_SPEC_INDEX.csv"
  "MASTER_SPEC_INDEX.md"
  "CHANGE_RISK_MATRIX.csv"
  "ENTERPRISE_OPERATING_PROC.md"
  "COMPLETE_GLOSSARY.txt"
  "ARCHITECTURE_METRICS_TEMPLATE.json"
  "RELEASE_ACCEPTANCE_DASHBOARD.md"
  "ENTERPRISE_READINESS_SCORECARD.md"
  "CODEX_DEPENDENCY_EXPORT.yaml"
  "GLOSSARY_TO_COMPONENT_LINKS.md"
  "INDEX_LINK_VERIFICATION.md"
  "REPO_TOUR.md"
  "FINAL_BUILD_MANIFEST.json"
  "DOC_COVERAGE_AUDIT.md"
  "API_CHANGE_REQUEST_TEMPLATE.txt"
  "CURRENT_GAPS.txt"
  "COMPONENT__Core_Runtime.txt"
  "COMPONENT__Combat_Loop.txt"
  "COMPONENT__Visual_Post_Process.txt"
  "COMPONENT__Asset_Pipeline.txt"
  "COMPONENT__Visual_Asset_Content.txt"
  "COMPONENT__Pages_Deployment.txt"
  "COMPONENT__Hub_Flow.txt"
  "COMPONENT__Mission_Flow.txt"
  "COMPONENT__Brand_Scene_Engine.txt"
  "COMPONENT__Local_Launch_Tooling.txt"
  "COMPONENT__Controls_Overlay.txt"
  "ORGANIZATION_OVERVIEW_MASTER.txt"
  "ENTERPRISE_HANDFOFF_PACKAGE.txt"
  "ENTERPRISE_QUICK_TAKEOVER_CARD.md"
  "ENTERPRISE_RELEASE_PULSE_TEMPLATE.md"
)

missing=0
for file in "${required_files[@]}"; do
  if [[ ! -f "${ROOT_DIR}/${file}" ]]; then
    echo "MISSING: ${file}"
    missing=1
  fi
done

if [[ $missing -eq 1 ]]; then
  echo "Doc audit result: FAILED"
  exit 1
fi

echo "Doc audit result: PASS"
