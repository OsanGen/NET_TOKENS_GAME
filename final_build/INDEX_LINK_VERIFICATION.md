# Index Link Verification — NEWGAME

Purpose
- Verify all canonical docs, entrypoints, and contracts remain discoverable and consistent.

Precheck
- Use absolute file references for each doc.
- Confirm no reference points to removed or stale paths.

1) Core source references
- `index.html` exists and is referenced by:
  - `BUILD_MAP.txt`
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `MASTER_SPEC_INDEX.md`
- `styles.css` exists and is referenced by:
  - `BUILD_MAP.txt`
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `MASTER_SPEC_INDEX.md`
- `game.js` exists and is referenced by:
  - `BUILD_MAP.txt`
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `MASTER_SPEC_INDEX.md`
- `web_game_playwright_client_local.js` exists and is referenced by:
  - `BUILD_MAP.txt`
  - `ENTERPRISE_TEST_MATRIX.md`
  - `MASTER_SPEC_INDEX.md`

2) Infrastructure and tooling references
- `.github/workflows/deploy-pages.yml` appears in:
  - `BUILD_MAP.txt`
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `SEQUENCED_RUNBOOK.txt`
- `scripts/open-game.sh`, `scripts/stop-game.sh` appear in:
  - `BUILD_MAP.txt`
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `SEQUENCED_RUNBOOK.txt`

3) Documentation graph references
- Every item in `ORGANIZATION_OVERVIEW_MASTER.txt` should exist in `final_build` directory.
- Every `COMPONENT__*.txt` entry should be included in:
  - `BUILD_MAP.txt` component mapping
  - `MASTER_SPEC_INDEX.md` or equivalent index reference
- Risk and readiness docs are all linked from:
  - `ORGANIZATION_OVERVIEW_MASTER.txt`
  - `MASTER_SPEC_INDEX.md`

4) Link consistency checks
- If a doc references another doc, both names must be unique and exact.
- No duplicate canonical names with different case variants.

5) Monthly maintenance action
- Open this checklist and run a full check after major UI or runtime changes.
- Add any missing link updates to `CURRENT_GAPS.txt` as `documentation` status item.

Pass conditions
- No missing-file references in `ORGANIZATION_OVERVIEW_MASTER.txt` and `MASTER_SPEC_INDEX.md`.
- No unresolved references between `COMPONENT__*.txt` and their owning maps.
- `CURRENT_GAPS.txt` reflects link drift remediation when discovered.
