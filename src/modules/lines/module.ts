import { linesManager } from '../../lib/linesManager';
import type { Module } from '../types';
import type { Coords } from '../../types';
import type { ComponentType } from 'react';

export interface LinesCfg {
  showLat: boolean;
  showLng: boolean;
}

const DEFAULTS: LinesCfg = { showLat: true, showLng: true };
const CFG_KEY = 'ogu_lines_cfg';

function loadCfg(): LinesCfg {
  try {
    const saved = GM_getValue<string | null>(CFG_KEY, null);
    if (!saved) return { ...DEFAULTS };
    const parsed = JSON.parse(saved);
    return {
      showLat: typeof parsed.showLat === 'boolean' ? parsed.showLat : DEFAULTS.showLat,
      showLng: typeof parsed.showLng === 'boolean' ? parsed.showLng : DEFAULTS.showLng,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

class LinesModule implements Module {
  readonly id = 'lines';
  readonly name = 'Lines';
  readonly description = 'Draw lat / lng lines through the real location';
  enabled = false;
  SettingsComponent?: ComponentType;

  private cfg: LinesCfg = loadCfg();

  getCfg(): LinesCfg {
    return this.cfg;
  }

  setCfg(patch: Partial<LinesCfg>): void {
    this.cfg = { ...this.cfg, ...patch };
    GM_setValue(CFG_KEY, JSON.stringify(this.cfg));
    linesManager.setCfg({ ...this.cfg, enabled: this.enabled });
    if (this.enabled) linesManager.applyAndDraw();
  }

  init(): void {
    linesManager.setCfg({ ...this.cfg, enabled: false });
  }

  enable(): void {
    this.enabled = true;
    linesManager.setCfg({ ...this.cfg, enabled: true });
    linesManager.tryDrawIfNeeded();
  }

  disable(): void {
    this.enabled = false;
    linesManager.setCfg({ ...this.cfg, enabled: false });
    linesManager.drop();
  }

  onCoords(coords: Coords): void {
    linesManager.setCoords(coords);
  }

  onNewRound(): void {
    linesManager.onNewRound();
  }

  onMapAdded(map: google.maps.Map): void {
    linesManager.addMap(map);
  }

  onReset(): void {
    linesManager.reset();
  }
}

export const linesModule = new LinesModule();
