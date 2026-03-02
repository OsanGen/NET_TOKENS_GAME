# Enterprise Test Matrix — NEWGAME

Purpose
- Provide explicit test mapping by feature, mode, and risk.

Legend
- F: Functional
- V: Visual
- S: Security/Resilience
- D: Documentation
- R: Regression

1) Mode transition matrix
- title→hub
  - F: keyboard/start path drives mode change
  - V: HUD/title status renders
  - R: mode value and timer progression
- hub→mission
  - F: launch path and mission state init
  - V: scene transition rendering
  - R: objective metadata resets appropriately
- mission→battle
  - F: threat path and action rail switch
  - V: effect and combat panel visibility
  - D: transition reflected in control text
- battle→mission/result
  - F: correct winner/loser branch to mission or result
  - R: stale combat metadata cleared
- result→hub
  - F: return loop completes
  - V: result panel fades correctly

2) API contract matrix
- `render_game_to_text` availability
  - F: callable after boot
  - R: contains mode/objective/action summary
- `advanceTime(ms)` availability
  - F: deterministic state advancement
  - S: invalid/negative ms handling documented and stable

3) UI contract matrix
- Required DOM nodes
  - R: selectors exist and are writable
  - F: HUD updates across modes
- Layout behavior
  - V: desktop/compact layout no overflow
  - R: control rail and action rail remain on viewport
- Motion profile behavior
  - V: reduced-motion and minimal profile readability

4) Input matrix
- `F`, `V`, `P`, `H` keys
  - F: expected mode behavior
  - R: no impact outside intended scope
- Action navigation keys
  - F: navigation directionality consistent with layout
  - V: selection feedback visible
- Attack/confirm/cancel
  - F: combat action resolves correctly
  - R: side and damage flow stable

5) Asset and rendering matrix
- Required sprite presence
  - F: no missing required sprite path
  - V: ship/planet/readability thresholds
- Visual scale checks
  - V: hub/mission/battle legibility in default viewport
  - R: no clipping of major entities

6) Deployment and tooling matrix
- Local launch/stop
  - R: repeated open/stop cycles pass
  - F: local page reachable
- Playwright smoke
  - F: selector/API path stable
  - R: flows reproduce across runs
- Pages deploy
  - F: required static files packaged
  - R: production URL loads correctly

7) Documentation matrix
- Build map fidelity
  - D: new changes reflected in `BUILD_MAP.txt`
- Gap visibility
  - D: `CURRENT_GAPS.txt` items include next action
- Component spec fidelity
  - D: impacted `COMPONENT__*.txt` include acceptance checks

8) Priority matrix by criticality
- P0: mode transitions, runtime APIs, critical input controls
- P1: HUD sync contract, deployment artifact completeness
- P2: reduced-motion safety, render readability
- P3: docs completeness and debt log updates

Execution rhythm
- Before each push: P0 matrix checks manually or via script.
- Weekly: P1 checks at minimum.
- Monthly: full matrix spot-check against changed components.
