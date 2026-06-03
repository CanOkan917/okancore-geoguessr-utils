# Okancore GeoGuessr Utils

A Tampermonkey userscript built with **Vite + React + TypeScript** that overlays training hints on the GeoGuessr guess map. All tools are independent modules that can be toggled from a draggable panel.

---

## Modules

| Module | Description |
|---|---|
| **Circle Creator** | Draws a semi-transparent circle around the real location. Radius is adjustable (10–3000 km). Center is randomly offset so the exact position is obscured. |
| **Lines** | Draws a red latitude line and/or a blue longitude line through the real location across the full map. |
| **Bands** | Draws semi-transparent rectangular bands along the real location's latitude and/or longitude. Each band has its own width slider (10–1000 km) and is randomly offset within the area. |
| **Street View Hider** | Hides the panorama so the location is not visible during the round. |

---

## Install (end users)

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Go to the [Releases](https://github.com/canokan917/okancore-geoguessr-utils/releases) page and download the latest `okancore-geoguessr-utils.user.js` — or click the raw file link and Tampermonkey will prompt you to install it automatically.
3. Navigate to [geoguessr.com](https://www.geoguessr.com). The panel appears in the top-right corner.

**Panel shortcuts:**
- Press **O** to show/hide the panel.
- Drag the header to reposition it anywhere on screen.

---

## Development

### Prerequisites

- Node.js ≥ 18
- A browser with Tampermonkey installed

### Setup

```bash
npm install
npm run dev
```

Vite starts a local dev server. Tampermonkey will prompt you to install a `localhost` version of the script — accept it. Every save triggers an instant update in the browser via Tampermonkey's dev mode.

### Build for release

```bash
npm run build
```

Outputs `dist/okancore-geoguessr-utils.user.js` — a single self-contained file ready to install. React is loaded from jsDelivr CDN via `@require` in the header.

---

## Project Structure

```
src/
├── main.tsx                   ← entry: intercepts, map hook, mounts React
├── App.tsx                    ← draggable panel, module cards
├── App.css                    ← panel styles
├── types.ts                   ← shared TypeScript interfaces
├── components/
│   └── Toggle.tsx             ← reusable toggle switch
├── modules/
│   ├── types.ts               ← Module interface
│   ├── registry.ts            ← ModuleRegistry — init, dispatch, persist enabled states
│   ├── index.ts               ← registers all modules
│   ├── circle/
│   │   ├── module.ts          ← CircleModule
│   │   └── CircleSettings.tsx ← radius slider + apply/remove buttons
│   ├── lines/
│   │   ├── module.ts          ← LinesModule
│   │   └── LinesSettings.tsx  ← lat/lng toggles
│   ├── bands/
│   │   ├── module.ts          ← BandsModule
│   │   └── BandsSettings.tsx  ← per-band width sliders + toggles
│   └── streetViewHider/
│       └── module.ts          ← StreetViewHiderModule (CSS injection)
└── lib/
    ├── intercept.ts           ← fetch + XHR hook for /api/v3/games/{id}
    ├── mapsHook.ts            ← google.maps.Map constructor proxy
    ├── findGuessMap.ts        ← shared utility to locate the guess map instance
    ├── circleManager.ts       ← circle draw/drop lifecycle
    ├── linesManager.ts        ← polyline draw/drop lifecycle
    ├── bandsManager.ts        ← rectangle band draw/drop lifecycle
    ├── urlWatcher.ts          ← MutationObserver for SPA navigation
    ├── gameState.ts           ← reactive signals for coords/round key
    ├── debugStore.ts          ← debug panel state signal
    └── signal.ts              ← minimal signal/subscribe utility
```

---

## How It Works

- **`@run-at document-start`** — fetch and XHR intercepts are installed before GeoGuessr's first API call.
- **Fetch/XHR intercept** — patches `unsafeWindow.fetch` and `XMLHttpRequest` to capture `/api/v3/games/{id}` responses and extract `rounds[n].lat/lng`.
- **Maps hook** — proxies the `google.maps.Map` constructor to collect all map instances, then identifies the guess map by walking the DOM for GeoGuessr's CSS class names.
- **Module registry** — all modules register once at startup. The registry dispatches game events (`newRound`, `coords`, `mapAdded`, `reset`) to every module. Each module decides independently whether to act based on its enabled state.
- **URL watcher** — a `MutationObserver` on `document` detects game ID changes and calls `reset()` on all modules.
- **Persistence** — each module's enabled state is saved in `GM_setValue('ogu_modules_enabled', ...)`. Module-specific settings (radius, width, etc.) are saved under their own keys.
