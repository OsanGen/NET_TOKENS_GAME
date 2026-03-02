# Enterprise Operating Procedure — NEWGAME

Purpose
- Standardize day-to-day ownership, triage, release decisions, and escalation.

1) Intake and triage
- Every issue is categorized:
  - P0: runtime breakage or critical flow failure
  - P1: major UX or gameplay regression
  - P2: polish/perf regressions
  - P3: docs and hygiene tasks
- Ownership routing:
  - P0 → immediate maintainer + quick patch or rollback
- Documentation requirement:
  - each triaged issue updates `CURRENT_GAPS.txt` with status and next action

2) Daily operating rhythm
- Morning:
  - validate `CURRENT_GAPS.txt` queue
  - verify no open blockers with missing next action
- Execution:
  - one component update per turn when possible
  - keep runtime behavior stable before visual-only tweaks
- End-of-day:
  - update impacted component docs
  - append brief evidence markers (if relevant) to gap log

3) Change control workflow
- Before code edits:
  - identify impacted components (`COMPONENT__*.txt` + `BUILD_MAP.txt`)
- During edit:
  - preserve gameplay contracts unless explicitly changing logic
  - keep style-only updates separate from logic updates when possible
- After edit:
  - update `CURRENT_GAPS.txt` status
  - update component docs and index references
  - run smoke checks (manual minimum: title→mission→battle→result)

4) Escalation
- P0 trigger:
  - immediate rollback plan and corrective branch within one turn
- P1 trigger:
  - isolate root cause and assign one owner
  - block unrelated changes until fixed
- P2/P3 trigger:
- schedule follow-up with no disruption to core user flow

5) Release gate
- Minimum acceptance before push:
  - core transitions stable
  - required DOM and API contracts present
  - reduced-motion readability verified
  - deployment artifact checklist complete
- Push/deploy only after gate pass is recorded.

6) Post-release review
- Immediately after release:
  - validate live URL and quick functional smoke
  - update `LINEAGE_AND_CHANGE_LOG.md` entry
  - close gap entries only with evidence

7) Documentation governance
- No component is updated without aligning:
  - `BUILD_MAP.txt`
  - impacted `COMPONENT__*.txt`
  - `CURRENT_GAPS.txt`
- No release without a fresh entry in:
  - `GAP_CLOSE_LOG.md` (if a gap is resolved)
  - `LINEAGE_AND_CHANGE_LOG.md` for milestone changes

8) Decision criteria for major redesign
- Approve only if:
  - user-visible gain is measurable in screenshots or flow readability
  - docs and contracts are updated before next release
  - fallback path to prior visual approach exists

9) Success metric
- A maintainer can locate:
  - architecture
  - contracts
  - tests
  - risks
  - deployment/rollback steps
  - within 10 minutes using only `final_build/*`.
