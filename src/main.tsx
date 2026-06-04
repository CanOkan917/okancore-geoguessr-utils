import { createRoot } from 'react-dom/client';
import { setupIntercepts, checkNextData } from './lib/intercept';
import { hookMaps } from './lib/mapsHook';
import { hookStreetView } from './lib/streetViewHook';
import { watchURL } from './lib/urlWatcher';
import { coordsSignal, roundKeySignal } from './lib/gameState';
import { dbg } from './lib/debugStore';
import { registry } from './modules';
import type { GameData } from './types';
import App from './App';

registry.initAll();

function handleGameData(data: GameData) {
  if (!data?.rounds?.length) return;

  const n = data.currentRoundNumber ?? data.rounds.length;
  const key = `${data.token ?? data.id}:${n}`;
  const isNew = key !== roundKeySignal.get();

  dbg(`intercept → roundNum:${n} key:${key} isNew:${isNew} rounds:${data.rounds.length}`, {
    rawRoundNum: String(data.currentRoundNumber ?? 'undefined'),
    roundsLen: String(data.rounds.length),
  });

  if (isNew) {
    roundKeySignal.set(key);
    dbg(`new round → ${key}`, { roundKey: key });
    registry.dispatchNewRound();
    coordsSignal.set(null);
  }

  const round = data.rounds[n - 1];
  const lat = round?.lat ?? round?.panorama?.lat;
  const lng = round?.lng ?? round?.panorama?.lng;
  if (!round || lat == null || lng == null) {
    dbg(`intercept → no coords for round ${n} (rounds.length=${data.rounds.length})`);
    return;
  }

  coordsSignal.set({ lat, lng });
  registry.dispatchCoords({ lat, lng });
}

setupIntercepts(handleGameData, () => {
  // POST to game endpoint = guess submitted, prepare for new round
  dbg('POST → round transition, clearing state');
  registry.dispatchNewRound();
  coordsSignal.set(null);
  roundKeySignal.set(null);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => checkNextData(handleGameData));
} else {
  checkNextData(handleGameData);
}

hookMaps(map => registry.dispatchMapAdded(map));

function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * (Math.PI / 180)) * Math.cos(b.lat * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
}

// Street View provides coords as fallback (when API doesn't cover the game mode).
// onCoords is called for every new pano; if the new pano is >20km away from the
// stored coords, we treat it as a round transition and reset state.
const svHook = hookStreetView(coords => {
  const current = coordsSignal.get();
  if (current && distKm(current, coords) < 20) return;
  if (current) {
    dbg('streetView → >20km shift → new round');
    registry.dispatchNewRound();
    coordsSignal.set(null);
    roundKeySignal.set(null);
  }
  dbg('streetView → coords', { coords: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` });
  coordsSignal.set(coords);
  registry.dispatchCoords(coords);
});

watchURL(() => {
  registry.dispatchReset();
  coordsSignal.set(null);
  roundKeySignal.set(null);
  svHook.reset();
});

// Exposed for the manual refresh button in App
export function forceRefresh() {
  dbg('manual refresh');
  registry.dispatchNewRound();
  coordsSignal.set(null);
  roundKeySignal.set(null);
  svHook.redetect();
}

function injectFont() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

function mount() {
  if (document.getElementById('ogu-root')) return;
  injectFont();
  const root = document.createElement('div');
  root.id = 'ogu-root';
  document.body.appendChild(root);
  createRoot(root).render(<App onRefresh={forceRefresh} />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
