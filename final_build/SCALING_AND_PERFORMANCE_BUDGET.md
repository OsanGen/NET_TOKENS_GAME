# Scaling and Performance Budget — NEWGAME

Assumptions
- Static browser runtime with per-frame simulation + canvas rendering + DOM sync.
- No backend.

Frame-time budget (target)
- Desktop target: smooth 60fps for normal flow.
- Mobile target: stable 30+fps baseline for standard gameplay.
- Budget split (conceptual):
  - update logic: < 40%
  - render pipeline: < 50%
  - DOM sync + post-process: < 10%

Hot paths
1. `update()` mode branches
- risk: mission and battle state branching explosion.
- mitigation: profile and early-out transitions.

2. `render()` full canvas paint path
- risk: high visual load under particle/bloom stacking.
- mitigation: cap bursts and post-process passes in non-critical profile.

3. HUD sync writes
- risk: frequent DOM writes at frame rate.
- mitigation: avoid full rerender and stabilize string changes for unchanged fields.

4. Asset decoding/loads
- risk: first-load stalls or missing frames.
- mitigation: keep required sprites present and stable naming.

Scaling policy for rendering quality
- Render scale buckets:
  - small viewport / low DPR: scaled smooth up with moderate anti-aliasing
  - standard viewport / normal DPR: crisp baseline with optional nearest fallback
  - high DPR: anti-aliasing tuned for readability with effect cap
- Effect intensity policy:
  - normal profile: moderate pulses and limited overlap
  - cinematic profile: elevated effects but bounded by frame clamps
  - minimal/reduced profile: strict effect suppression

Visual payload budget
- Effect count per hit:
  - max concurrent layers limited to prevent overdraw spikes
- Pulse duration:
  - short bounded windows, no persistent overlay accumulation

Optimization rules
- No frame should spawn unbounded particles without duration cap.
- No unbounded loops over static entity sets.
- Post-process should branch on effect flags, not evaluate all filters continuously.

Observability
- Track:
  - mode dwell times
  - battle action throughput
  - frame timing from browser tooling (manual)
  - screenshot diffs for visual regressions

Scaling readiness checkpoints
- 2x visual stress test with increased activity.
- 1.5x UI spam test (rapid input sequences).
- Repeated local open/close loops for script reliability.

Known performance debts
- One-file runtime concentration creates accidental complexity in optimization.
- DOM sync and render effects share same authoring surface.
- No telemetry loop yet for automated frame metrics.
