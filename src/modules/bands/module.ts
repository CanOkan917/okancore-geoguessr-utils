import { bandsManager } from '../../lib/bandsManager';
import type { Module } from '../types';
import type { Coords } from '../../types';
import type { ComponentType } from 'react';

export interface BandsCfg {
  latWidthKm: number;
  lngWidthKm: number;
  showLat: boolean;
  showLng: boolean;
}

const DEFAULTS: BandsCfg = { latWidthKm: 100, lngWidthKm: 100, showLat: true, showLng: true };
const CFG_KEY = 'ogu_bands_cfg';

function loadCfg(): BandsCfg {
  try {
    const saved = GM_getValue<string | null>(CFG_KEY, null);
    if (!saved) return { ...DEFAULTS };
    const p = JSON.parse(saved);
    return {
      latWidthKm: typeof p.latWidthKm === 'number' ? p.latWidthKm : DEFAULTS.latWidthKm,
      lngWidthKm: typeof p.lngWidthKm === 'number' ? p.lngWidthKm : DEFAULTS.lngWidthKm,
      showLat: typeof p.showLat === 'boolean' ? p.showLat : DEFAULTS.showLat,
      showLng: typeof p.showLng === 'boolean' ? p.showLng : DEFAULTS.showLng,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

class BandsModule implements Module {
  readonly id = 'bands';
  readonly name = 'Bands';
  readonly description = 'Draw lat / lng rectangular bands through the real location';
  enabled = false;
  SettingsComponent?: ComponentType;

  private cfg: BandsCfg = loadCfg();

  getCfg(): BandsCfg {
    return this.cfg;
  }

  private sync(enabled: boolean) {
    bandsManager.setCfg({ ...this.cfg, enabled });
  }

  setCfg(patch: Partial<BandsCfg>): void {
    this.cfg = { ...this.cfg, ...patch };
    GM_setValue(CFG_KEY, JSON.stringify(this.cfg));
    this.sync(this.enabled);
    if (this.enabled) bandsManager.applyAndDraw();
  }

  init(): void {
    this.sync(false);
  }

  enable(): void {
    this.enabled = true;
    this.sync(true);
    bandsManager.tryDrawIfNeeded();
  }

  disable(): void {
    this.enabled = false;
    this.sync(false);
    bandsManager.drop();
  }

  onCoords(coords: Coords): void {
    bandsManager.setCoords(coords);
  }

  onNewRound(): void {
    bandsManager.onNewRound();
  }

  onMapAdded(map: google.maps.Map): void {
    bandsManager.addMap(map);
  }

  onReset(): void {
    bandsManager.reset();
  }
}

export const bandsModule = new BandsModule();
