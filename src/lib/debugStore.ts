import { createSignal } from './signal';

export interface DebugState {
  roundKey: string;
  coords: string;
  circleStatus: string;
  mapCount: number;
  lastEvent: string;
  rawRoundNum: string;
  roundsLen: string;
  lastApiUrl: string;
}

const initial: DebugState = {
  roundKey: '—',
  coords: '—',
  circleStatus: 'none',
  mapCount: 0,
  lastEvent: '—',
  rawRoundNum: '—',
  roundsLen: '—',
  lastApiUrl: '—',
};

export const debugSignal = createSignal<DebugState>({ ...initial });

export function dbg(event: string, patch?: Partial<DebugState>) {
  const next = { ...debugSignal.get(), lastEvent: event, ...patch };
  debugSignal.set(next);
  console.log(`[OGU] ${event}`, patch ?? '');
}
