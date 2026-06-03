# Okancore GeoGuessr Utils

A Tampermonkey userscript built with **Vite + React + TypeScript** that draws a radius circle around the real location on the GeoGuessr guess map before you submit your guess.

---

## Install (end users)

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Go to the [Releases](https://github.com/canokan917/okancore-geoguessr-utils/releases) page and download the latest `okancore-geoguessr-utils.user.js` — or click the raw file link and Tampermonkey will prompt you to install it automatically.
3. Navigate to [geoguessr.com](https://www.geoguessr.com). The panel appears in the top-right corner.

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

Vite starts a local dev server. Tampermonkey will prompt you to install a `localhost` version of the script — accept it. From that point on, every save triggers an instant update in the browser (HMR via Tampermonkey's dev mode).

### Build for release

```bash
npm run build
```

Outputs `dist/okancore-geoguessr-utils.user.js` — a single self-contained `.user.js` file ready to install. React is loaded from jsDelivr CDN via `@require` in the header, keeping the file small (~17 kB).

---

## Project Structure

```
src/
├── main.tsx              ← entry point: intercepts + mounts React
├── App.tsx               ← floating panel component
├── App.css               ← panel styles (injected via GM_addStyle)
├── types.ts              ← shared TypeScript interfaces
├── components/
│   └── Toggle.tsx        ← reusable toggle switch
├── hooks/
│   └── useConfig.ts      ← config state with GM_getValue/GM_setValue persistence
└── lib/
    ├── intercept.ts      ← fetch + XHR hook for /api/v3/games/{id}
    ├── mapsHook.ts       ← google.maps.Map constructor proxy
    ├── circleManager.ts  ← circle draw/drop lifecycle
    ├── urlWatcher.ts     ← MutationObserver for SPA navigation
    ├── gameState.ts      ← reactive signals for coords/round
    └── signal.ts         ← minimal signal/subscribe utility
```

---

## How It Works

- **`@run-at document-start`** — fetch and XHR intercepts are installed before GeoGuessr's first API call.
- **Fetch/XHR intercept** — patches `unsafeWindow.fetch` and `XMLHttpRequest` to capture `/api/v3/games/{id}` responses and extract `rounds[currentRoundNumber - 1].lat/lng`.
- **Maps hook** — proxies the `google.maps.Map` constructor (already loaded by GeoGuessr) to collect map instances.
- **Circle manager** — finds the guess map by walking each map's container DOM for GeoGuessr's CSS class names, then draws a `google.maps.Circle` on it.
- **URL watcher** — a `MutationObserver` on `document` detects game ID changes and resets all state.

---

## Panel Controls

| Control | Description |
|---|---|
| **Enabled** | Master on/off toggle. Disabling drops the current circle. |
| **Multi-round** | When on, redraws automatically on each new round. When off, only draws via **Apply & Draw**. |
| **Radius** | Circle radius in kilometers (10–20000). Committed on blur or Enter. |
| **Color** | Fill and stroke color for the circle. |
| **Apply & Draw** | Redraws the circle with the current settings. |
| **Remove Circle** | Drops the circle without disabling the mod. |
| **− / +** | Collapse or expand the panel. |

---

## Config Defaults

```ts
{
  radius: 500,          // km
  enabled: true,
  multiRound: true,
  circleColor: '#00e5ff',
  circleOpacity: 0.18,
  strokeColor: '#00e5ff',
  strokeWeight: 2.5,
}
```

Config persists across sessions via `GM_getValue` / `GM_setValue`.
