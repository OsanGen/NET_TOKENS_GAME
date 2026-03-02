# Documentation Deprecation Index — NEWGAME

Purpose
- Track deprecated or superseded docs to avoid confusion and duplication.

Deprecation policy
- Any doc may be deprecated only with owner approval and migration note.
- Deprecated entries remain readable for history but are excluded from canonical indexes.

Current status
- `GAME_ARCHITECTURE_OVERVIEW.md` — superseded by `BUILD_MAP.txt` (if exists)
  - action: migrate references
- `README_DEV_NOTES.md` — superseded by `ENTERPRISE_OPERATING_PROC.md`
  - action: mark for archival
- `legacy_style_notes.txt` — superseded by `COMPONENT__Visual_Post_Process.txt`, `styles.css` ownership docs
  - action: retire visual notes into one canonical component doc

Active aliases (do not use in canonical references)
- `FINAL_BUILD_MANIFEST.json` is canonical, not deprecated.
- Any `.bak`, `.old`, `_v1`, `_legacy` suffix docs are deprecated by convention.

How to deprecate
1. Add entry with reason and replacement pointer.
2. Update `ORGANIZATION_OVERVIEW_MASTER.txt` and `MASTER_SPEC_INDEX.md`.
3. Update this index with deprecation date and owner.

Current canonical docs (non-deprecated)
- All entries in `MASTER_SPEC_INDEX.md` that are actively linked.
