import { createRoot } from 'react-dom/client';
import { setupIntercepts } from './lib/intercept';
import { hookMaps } from './lib/mapsHook';
import { watchURL } from './lib/urlWatcher';
import { circleManager } from './lib/circleManager';
import { coordsSignal, roundKeySignal } from './lib/gameState';
import App from './App';

// ── Intercepts (document-start) ───────────────────────────────────────────────

setupIntercepts(data => {
  if (!data?.rounds?.length) return;

  const n = data.currentRoundNumber ?? 1;
  const round = data.rounds[n - 1];
  if (!round || round.lat == null) return;

  const key = `${data.token ?? data.id}:${n}`;
  const isNew = key !== roundKeySignal.get();
  roundKeySignal.set(key);
  coordsSignal.set({ lat: round.lat, lng: round.lng });

  circleManager.setCoords({ lat: round.lat, lng: round.lng });
  if (isNew) circleManager.onNewRound();
});

hookMaps(map => circleManager.addMap(map));

watchURL(() => {
  circleManager.reset();
  coordsSignal.set(null);
  roundKeySignal.set(null);
});

// ── Mount React panel ─────────────────────────────────────────────────────────

function injectFont() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
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
