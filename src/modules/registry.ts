import type { Module } from './types';
import type { Coords } from '../types';

const ENABLED_KEY = 'ogu_modules_enabled';

class ModuleRegistry {
  private modules: Module[] = [];

  register(module: Module): void {
    this.modules.push(module);
  }

  getAll(): readonly Module[] {
    return this.modules;
  }

  initAll(): void {
    const saved = this.loadEnabledStates();
    for (const m of this.modules) {
      m.init();
      const shouldEnable = saved[m.id] ?? m.enabled;
      if (shouldEnable) m.enable();
      else m.disable();
    }
  }

  setEnabled(id: string, enabled: boolean): void {
    const m = this.modules.find(x => x.id === id);
    if (!m) return;
    if (enabled) m.enable();
    else m.disable();
    this.saveEnabledStates();
  }

  dispatchCoords(coords: Coords): void {
    this.modules.forEach(m => m.onCoords?.(coords));
  }

  dispatchNewRound(): void {
    this.modules.forEach(m => m.onNewRound?.());
  }

  dispatchMapAdded(map: google.maps.Map): void {
    this.modules.forEach(m => m.onMapAdded?.(map));
  }

  dispatchReset(): void {
    this.modules.forEach(m => m.onReset?.());
  }

  private saveEnabledStates(): void {
    const state: Record<string, boolean> = {};
    for (const m of this.modules) state[m.id] = m.enabled;
    GM_setValue(ENABLED_KEY, JSON.stringify(state));
  }

  private loadEnabledStates(): Record<string, boolean> {
    try {
      const saved = GM_getValue<string | null>(ENABLED_KEY, null);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }
}

export const registry = new ModuleRegistry();
