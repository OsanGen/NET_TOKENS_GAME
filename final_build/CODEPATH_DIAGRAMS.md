# Code Path Diagrams — NEWGAME

## Startup Path

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as index.html
    participant CSS as styles.css
    participant JS as game.js
    participant DOM as UI Nodes
    participant API as window API

    Browser->>HTML: load document
    HTML->>CSS: load style tokens/layout
    HTML->>JS: execute runtime
    JS->>DOM: query control/canvas nodes
    JS->>API: expose render_game_to_text, advanceTime
    JS->>DOM: init HUD state
    JS->>Browser: start render/update loop
```

## Title → Hub Flow

```mermaid
sequenceDiagram
    participant User
    participant Input as Input Handler
    participant Update as Update Loop
    participant Renderer as Render Engine
    participant UI as HUD Sync

    User->>Input: Start action
    Input->>Update: set mode transition intent
    Update->>Update: mutate mode to hub
    Update->>Renderer: render hub scene
    Renderer->>UI: sync mode/objective text
```

## Hub → Mission Launch Path

```mermaid
sequenceDiagram
    participant User
    participant Hub as Hub Mode Handler
    participant State as Game State
    participant Render as Render
    participant HUD as Controls Overlay

    User->>Hub: lock + launch action
    Hub->>State: validate launch readiness
    State->>State: set mission state
    State->>Render: draw launch transition + mission scene
    Render->>HUD: update objective/action rail text
```

## Mission → Battle Loop

```mermaid
sequenceDiagram
    participant Mission as Mission Handler
    participant Threat as Threat Check
    participant Battle as Battle Handler
    participant VFX as Post-process
    participant UI as HUD Sync

    Mission->>Threat: evaluate threat + objective conditions
    Threat-->>Mission: enter battle
    Mission->>Battle: mode = battle + initialize turns
    Battle->>Battle: resolve action selection and damage
    Battle->>VFX: queue impact pulses
    VFX->>UI: preserve readability and side intent
    Battle->>Mission: return on completion
```

## Combat Attack Visual Path

```mermaid
sequenceDiagram
    participant Input as Player/Enemy Input
    participant Combat as Combat Resolver
    participant State as Combat State
    participant Visual as VFX Layer
    participant API as render_game_to_text
    participant HUD as HUD/Canvas

    Input->>Combat: execute action
    Combat->>State: compute damage + side metadata
    Combat->>State: store impact color/seed/tone
    State->>Visual: apply burst + streak + flash
    Visual->>HUD: draw frame + overlay
    Combat->>API: retain deterministic snapshot
```

## External Automation Path

```mermaid
sequenceDiagram
    participant Runner as web_game_playwright_client_local.js
    participant Browser as Browser Context
    participant DOM as index.html UI
    participant JS as game.js
    participant Snapshot as render_game_to_text

    Runner->>Browser: open deployed/local page
    Runner->>DOM: target key controls
    Runner->>JS: invoke advanceTime / key actions
    JS->>Snapshot: output deterministic state
    Runner->>Runner: assert transitions + capture screenshot
```

## Deploy Path

```mermaid
sequenceDiagram
    participant Git as Git Push
    participant CI as deploy-pages workflow
    participant Artifact as GitHub Pages Artifact
    participant Site as Public URL

    Git->>CI: push to main
    CI->>Artifact: bundle index.html + game.js + styles.css + assets
    Artifact->>Site: publish static site
    Site->>Runner: ready for smoke verification
```

## Notes on extension
- Add sequence nodes for any new gameplay mode before altering control contracts.
- Keep each sequence keyed to an acceptance check in component docs.
