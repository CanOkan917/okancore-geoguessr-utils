import { createSignal } from './signal';
import type { Coords } from '../types';

export const coordsSignal = createSignal<Coords | null>(null);
export const roundKeySignal = createSignal<string | null>(null);
