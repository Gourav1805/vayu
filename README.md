# DEVLOK / VAYU · atmospheric intelligence

VAYU is a replay-mode thunderstorm-intelligence demonstrator for SIH 2026 problem statement 26072. RAVI is the atmospheric-intelligence orchestration concept. The application remains a static Node.js server with scenario fixtures and explicit simulation disclosures. The legacy SatQuery experience remains available at [`/satquery.html`](satquery.html); its supporting files and standalone demos are retained in `archive/satquery/`.

## Run locally

Requires Node.js. No package installation, API credentials, or external service is needed.

```powershell
npm start
```

Open <http://localhost:3000>. `PORT` can override the default port.

## DEVLOK / VAYU workspace

- `/` — “One atmosphere. Many questions.” mission selector
- `/live-nowcast` — GIS-style map, storm object, layers, timeline, evidence, source health, and triage
- `/storm-intelligence` — persistent object, storm evolution timeline, track tabs, evidence, and lineage state
- `/initiation` — new-cell candidate and advection-only comparison
- `/forecasts` — WARN / WATCH / INSUFFICIENT DATA review queue
- `/fusion` — animated radar + INSAT + lightning-to-object concept
- `/ravi` — animated agent decision and evidence trace
- `/replay` — scene-led storm evolution, hazard expansion, and time controls
- `/analytics` — verification and provenance workspaces
- `/reports` — printable forecast and forecaster briefings
- `/settings` — local preferences and integration status

The route/page transformation map is in [`docs/vayu-transformation-map.md`](docs/vayu-transformation-map.md).

## Data and model status

No radar, INSAT, IMD, MOSDAC, IMDAA, lightning-network, NWP, or historical dataset is connected. Weather map layers, source ages, storm-object values, initiation fields, and replay outputs are simulated or illustrative. The map is a schematic, not geographically calibrated. The object-motion view is a deterministic centroid-baseline demonstration, not an operational forecast. No trained model or verification score is implemented. The lightning layer is a likelihood proxy label; observed lightning is unavailable. Confidence and alert states are illustrative, and triage remains a human action.

Triage dispositions and preferences are saved in browser local storage. They are not server-side or immutable records. Report generation produces a local printable preview only.
