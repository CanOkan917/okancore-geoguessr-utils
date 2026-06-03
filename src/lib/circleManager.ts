import type { Config, Coords } from '../types';
import { dbg } from './debugStore';
import { findGuessMap } from './findGuessMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

class CircleManager {
  private maps: google.maps.Map[] = [];
  private circle: google.maps.Circle | null = null;
  private coords: Coords | null = null;
  private cfg: Config | null = null;
  private needsRedraw = false;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  setCfg(cfg: Config): void {
    this.cfg = cfg;
  }

  setCoords(coords: Coords): void {
    this.coords = coords;
    dbg('setCoords', { coords: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` });
    if (this.needsRedraw) {
      dbg('setCoords → needsRedraw, triggering tryDraw');
      this.tryDraw();
    } else {
      this.tryDrawIfNeeded();
    }
  }

  addMap(map: google.maps.Map): void {
    this.maps.push(map);
    dbg(`addMap (total: ${this.maps.length}, needsRedraw: ${this.needsRedraw})`, {
      mapCount: this.maps.length,
    });

    if (this.needsRedraw) {
      this.tryDraw();
    } else {
      this.tryDrawIfNeeded();
    }
  }

  onNewRound(): void {
    dbg('onNewRound → drop', { circleStatus: 'dropping' });
    this.drop();
    this.coords = null;

    this.cancelTimer();
    this.needsRedraw = true;
    this.fallbackTimer = setTimeout(() => {
      if (this.needsRedraw) {
        dbg('onNewRound fallback timer → tryDraw');
        this.tryDraw();
      }
    }, 1500);
  }


  private cancelTimer(): void {
    if (this.fallbackTimer !== null) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  tryDrawIfNeeded(): void {
    dbg(`tryDrawIfNeeded (circle: ${!!this.circle}, enabled: ${this.cfg?.enabled}, coords: ${!!this.coords})`);
    if (!this.circle && this.cfg?.enabled && this.coords) {
      this.tryDraw();
    }
  }

  applyAndDraw(): void {
    if (this.coords) { this.drop(); this.tryDraw(); }
  }

  drop(): void {
    if (this.circle) {
      dbg('drop → setMap(null)', { circleStatus: 'none' });
      this.circle.setMap(null);
      this.circle = null;
    }
  }

  reset(): void {
    dbg('reset (game/URL change)');
    this.cancelTimer();
    this.needsRedraw = false;
    this.drop();
    this.maps = [];
    this.coords = null;
  }

  private findGuessMap(): google.maps.Map | null {
    return findGuessMap(this.maps);
  }

  private offsetCenter(coords: Coords, radiusKm: number): Coords {
    const angle = Math.random() * 2 * Math.PI;
    const dist = radiusKm * (0.35 + Math.random() * 0.45);
    const deltaLat = (dist * Math.sin(angle)) / 111;
    const deltaLng = (dist * Math.cos(angle)) / (111 * Math.cos(coords.lat * Math.PI / 180));
    return { lat: coords.lat + deltaLat, lng: coords.lng + deltaLng };
  }

  private tryDraw(): void {
    if (!this.cfg?.enabled || !this.coords) {
      dbg(`tryDraw → skipped (enabled: ${this.cfg?.enabled}, coords: ${!!this.coords})`);
      return;
    }
    const map = this.findGuessMap();
    if (!map) {
      dbg(`tryDraw → no guess map found (total maps: ${this.maps.length})`);
      return;
    }

    this.drop();
    this.cancelTimer();
    this.needsRedraw = false;
    const center = this.offsetCenter(this.coords, this.cfg.radius);
    this.circle = new win.google.maps.Circle({
      map,
      center,
      radius: this.cfg.radius * 1000,
      fillColor: '#ef4444',
      fillOpacity: 0.15,
      strokeColor: '#ef4444',
      strokeWeight: 2,
      clickable: false,
      zIndex: 1,
    }) as google.maps.Circle;

    dbg('tryDraw → circle drawn ✓', {
      circleStatus: `drawn @ ${this.coords.lat.toFixed(4)}, ${this.coords.lng.toFixed(4)}`,
    });
  }
}

export const circleManager = new CircleManager();
