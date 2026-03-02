# Glossary to Component Link Map — NEWGAME

This file links glossary terms to primary owning components and implementation artifacts.

Runtime and game state
- `mode` -> `game.js`, `COMPONENT__Core_Runtime.txt`, `COMPONENT__Hub_Flow.txt`, `COMPONENT__Mission_Flow.txt`
- `battle` -> `game.js`, `COMPONENT__Combat_Loop.txt`, `COMPONENT__Visual_Post_Process.txt`
- `mission` -> `game.js`, `COMPONENT__Mission_Flow.txt`
- `visual` -> `game.js`, `styles.css`, `COMPONENT__Visual_Post_Process.txt`

Rendering and effects
- `render` -> `game.js`, `COMPONENT__Visual_Post_Process.txt`
- `post-process` -> `game.js`, `styles.css`, `COMPONENT__Visual_Post_Process.txt`
- `pulse` -> `game.js`
- `impact` -> `game.js`
- `profile` -> `game.js`, `styles.css`
- `preset` -> `game.js`, `styles.css`

Controls and input
- `syncExternalControlsUI` -> `game.js`, `COMPONENT__Controls_Overlay.txt`
- `HUD` -> `index.html`, `styles.css`, `COMPONENT__Controls_Overlay.txt`, `BUILD_MAP.txt`
- `action rail` -> `index.html`, `styles.css`
- `side rail` -> `index.html`, `styles.css`

Runtime API
- `render_game_to_text` -> `game.js`, `web_game_playwright_client_local.js`, `FILE_TO_FEATURE_MATRIX.txt`
- `advanceTime(ms)` -> `game.js`, `web_game_playwright_client_local.js`

Tooling
- local launch -> `scripts/open-game.sh`, `scripts/stop-game.sh`, `COMPONENT__Local_Launch_Tooling.txt`
- Playwright smoke -> `web_game_playwright_client_local.js`, `SEQUENCED_RUNBOOK.txt`
- Pages publish -> `.github/workflows/deploy-pages.yml`, `COMPONENT__Pages_Deployment.txt`

Documentation and governance
- `BUILD_MAP` -> `BUILD_MAP.txt`, `ORGANIZATION_OVERVIEW_MASTER.txt`
- `CURRENT_GAPS` -> `CURRENT_GAPS.txt`, `GAP_CLOSE_LOG.md`
- `enterprise readiness` -> `ENTERPRISE_HANDFOFF_PACKAGE.txt`, `ENTERPRISE_READINESS_SCORECARD.md`
- `architecture data flow` -> `ARCHITECTURE_DATA_FLOW.txt`
- `risk matrix` -> `CHANGE_RISK_MATRIX.csv`, `TECH_DEBT_LOG.md`, `SECURITY_AND_RELIABILITY_ASSERTIONS.txt`
