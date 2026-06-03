import { createRoot } from 'react-dom/client';
import { setupIntercepts } from './lib/intercept';
import { hookMaps } from './lib/mapsHook';
import { watchURL } from './lib/urlWatcher';
import { circleManager } from './lib/circleManager';
import { coordsSignal, roundKeySignal } from './lib/gameState';
import { dbg } from './lib/debugStore';
import App from './App';

// ── Intercepts (document-start) ───────────────────────────────────────────────

setupIntercepts(data => {
  if (!data?.rounds?.length) return;

  const n = data.currentRoundNumber ?? data.rounds.length;
  const key = `${data.token ?? data.id}:${n}`;
  const isNew = key !== roundKeySignal.get();

  dbg(`intercept → roundNum:${n} key:${key} isNew:${isNew} rounds:${data.rounds.length}`, {
    rawRoundNum: String(data.currentRoundNumber ?? 'undefined'),
    roundsLen: String(data.rounds.length),
  });

  // Detect round change BEFORE checking coords — the new round's coords may
  // not be present in the first API response for that round, but we still
  // need to drop the old circle immediately.
  if (isNew) {
    roundKeySignal.set(key);
    dbg(`new round → ${key}`, { roundKey: key });
    circleManager.onNewRound();
  }

  const round = data.rounds[n - 1];
  if (!round || round.lat == null) {
    dbg(`intercept → no coords for round ${n} (rounds.length=${data.rounds.length})`);
    return;
  }

  coordsSignal.set({ lat: round.lat, lng: round.lng });
  circleManager.setCoords({ lat: round.lat, lng: round.lng });

  // Coords arrived for the same round (follow-up API call) — ensure circle is drawn.
  if (!isNew) circleManager.tryDrawIfNeeded();
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
