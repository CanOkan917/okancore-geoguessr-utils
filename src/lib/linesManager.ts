import type { Coords } from '../types';
import { findGuessMap } from './findGuessMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

export interface LinesCfg {
  enabled: boolean;
  showLat: boolean;
  showLng: boolean;
}

class LinesManager {
  private maps: google.maps.Map[] = [];
  private latLine: google.maps.Polyline | null = null;
  private lngLine: google.maps.Polyline | null = null;
  private coords: Coords | null = null;
  private cfg: LinesCfg | null = null;
  private needsRedraw = false;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  setCfg(cfg: LinesCfg): void {
    this.cfg = cfg;
  }

  setCoords(coords: Coords): void {
    this.coords = coords;
    if (this.needsRedraw) this.tryDraw();
    else this.tryDrawIfNeeded();
  }

  addMap(map: google.maps.Map): void {
    this.maps.push(map);
    if (this.needsRedraw) this.tryDraw();
    else this.tryDrawIfNeeded();
  }

  onNewRound(): void {
    this.drop();
    this.coords = null;
    this.cancelTimer();
    this.needsRedraw = true;
    this.fallbackTimer = setTimeout(() => {
      if (this.needsRedraw) this.tryDraw();
    }, 1500);
  }

  tryDrawIfNeeded(): void {
    if (!this.hasAnyLine() && this.cfg?.enabled && this.coords) {
      this.tryDraw();
    }
  }

  applyAndDraw(): void {
    if (this.coords) { this.drop(); this.tryDraw(); }
  }

  drop(): void {
    this.latLine?.setMap(null);
    this.latLine = null;
    this.lngLine?.setMap(null);
    this.lngLine = null;
  }

  reset(): void {
    this.cancelTimer();
    this.needsRedraw = false;
    this.drop();
    this.maps = [];
    this.coords = null;
  }

  private hasAnyLine(): boolean {
    return this.latLine !== null || this.lngLine !== null;
  }

  private cancelTimer(): void {
    if (this.fallbackTimer !== null) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  private tryDraw(): void {
    if (!this.cfg?.enabled || !this.coords) return;
    const map = findGuessMap(this.maps);
    if (!map) return;

    this.drop();
    this.cancelTimer();
    this.needsRedraw = false;

    const { lat, lng } = this.coords;

    if (this.cfg.showLat) {
      const latPath: { lat: number; lng: number }[] = [];
      for (let l = -180; l <= 180; l += 5) latPath.push({ lat, lng: l });
      this.latLine = new win.google.maps.Polyline({
        map,
        path: latPath,
        geodesic: false,
        strokeColor: '#ef4444',
        strokeWeight: 2,
        strokeOpacity: 0.85,
        clickable: false,
        zIndex: 2,
      }) as google.maps.Polyline;
    }

    if (this.cfg.showLng) {
      this.lngLine = new win.google.maps.Polyline({
        map,
        path: [{ lat: -85, lng }, { lat: 85, lng }],
        strokeColor: '#3b82f6',
        strokeWeight: 2,
        strokeOpacity: 0.85,
        clickable: false,
        zIndex: 2,
      }) as google.maps.Polyline;
    }
  }
}

export const linesManager = new LinesManager();
