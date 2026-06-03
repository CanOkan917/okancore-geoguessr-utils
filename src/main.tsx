import { createRoot } from 'react-dom/client';
import { setupIntercepts } from './lib/intercept';
import { hookMaps } from './lib/mapsHook';
import { watchURL } from './lib/urlWatcher';
import { coordsSignal, roundKeySignal } from './lib/gameState';
import { dbg } from './lib/debugStore';
import { registry } from './modules';
import App from './App';

registry.initAll();

setupIntercepts(data => {
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
  }

  const round = data.rounds[n - 1];
  if (!round || round.lat == null) {
    dbg(`intercept → no coords for round ${n} (rounds.length=${data.rounds.length})`);
    return;
  }

  coordsSignal.set({ lat: round.lat, lng: round.lng });
  registry.dispatchCoords({ lat: round.lat, lng: round.lng });

  if (!isNew) {
    // Follow-up API call for the same round — nudge modules that may need to act.
    // Each module handles internally whether to re-draw or not.
  }
});

hookMaps(map => registry.dispatchMapAdded(map));

watchURL(() => {
  registry.dispatchReset();
  coordsSignal.set(null);
  roundKeySignal.set(null);
});

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
  createRoot(root).render(<App />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
