import { circleManager } from '../../lib/circleManager';
import type { Module } from '../types';
import type { Coords } from '../../types';
import type { ComponentType } from 'react';

export interface CircleCfg {
  radius: number;
}

const DEFAULTS: CircleCfg = { radius: 500 };
const CFG_KEY = 'ogu_cfg';

function loadCfg(): CircleCfg {
  try {
    const saved = GM_getValue<string | null>(CFG_KEY, null);
    if (!saved) return { ...DEFAULTS };
    const parsed = JSON.parse(saved);
    return {
      radius: typeof parsed.radius === 'number' ? parsed.radius : DEFAULTS.radius,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

class CircleModule implements Module {
  readonly id = 'circle';
  readonly name = 'Circle Creator';
  readonly description = 'Draw a radius hint circle on the guess map';
  enabled = false;
  SettingsComponent?: ComponentType;

  private cfg: CircleCfg = loadCfg();

  getCfg(): CircleCfg {
    return this.cfg;
  }

  setCfg(patch: Partial<CircleCfg>): void {
    this.cfg = { ...this.cfg, ...patch };
    GM_setValue(CFG_KEY, JSON.stringify(this.cfg));
    circleManager.setCfg({ ...this.cfg, enabled: this.enabled });
    if (this.enabled) circleManager.applyAndDraw();
  }

  init(): void {
    circleManager.setCfg({ ...this.cfg, enabled: false });
  }

  enable(): void {
    this.enabled = true;
    circleManager.setCfg({ ...this.cfg, enabled: true });
    circleManager.tryDrawIfNeeded();
  }

  disable(): void {
    this.enabled = false;
    circleManager.setCfg({ ...this.cfg, enabled: false });
    circleManager.drop();
  }

  onCoords(coords: Coords): void {
    circleManager.setCoords(coords);
  }

  onNewRound(): void {
    circleManager.onNewRound();
  }

  onMapAdded(map: google.maps.Map): void {
    circleManager.addMap(map);
  }

  onReset(): void {
    circleManager.reset();
  }

  applyAndDraw(): void {
    circleManager.applyAndDraw();
  }

  drop(): void {
    circleManager.drop();
  }
}

export const circleModule = new CircleModule();
