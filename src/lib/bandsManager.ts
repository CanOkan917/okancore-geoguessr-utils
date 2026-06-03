import { findGuessMap } from './findGuessMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

export interface BandsCfg {
  enabled: boolean;
  latWidthKm: number;
  lngWidthKm: number;
  showLat: boolean;
  showLng: boolean;
}

class BandsManager {
  private maps: google.maps.Map[] = [];
  private latBand: google.maps.Rectangle | null = null;
  private lngBand: google.maps.Rectangle | null = null;
  private coords: { lat: number; lng: number } | null = null;
  private cfg: BandsCfg | null = null;
  private needsRedraw = false;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  setCfg(cfg: BandsCfg): void {
    this.cfg = cfg;
  }

  setCoords(coords: { lat: number; lng: number }): void {
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
    if (!this.hasAnyBand() && this.cfg?.enabled && this.coords) {
      this.tryDraw();
    }
  }

  applyAndDraw(): void {
    if (this.coords) { this.drop(); this.tryDraw(); }
  }

  drop(): void {
    this.latBand?.setMap(null);
    this.latBand = null;
    this.lngBand?.setMap(null);
    this.lngBand = null;
  }

  reset(): void {
    this.cancelTimer();
    this.needsRedraw = false;
    this.drop();
    this.maps = [];
    this.coords = null;
  }

  private hasAnyBand(): boolean {
    return this.latBand !== null || this.lngBand !== null;
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
    const halfLat = this.cfg.latWidthKm / 2;
    const halfLng = this.cfg.lngWidthKm / 2;
    const deltaLat = halfLat / 111;
    const deltaLng = halfLng / (111 * Math.cos((lat * Math.PI) / 180));

    // Random offset so real location is inside but not at centre (max 80% from edge)
    const latOffset = (Math.random() * 2 - 1) * deltaLat * 0.8;
    const lngOffset = (Math.random() * 2 - 1) * deltaLng * 0.8;
    const centerLat = lat + latOffset;
    const centerLng = lng + lngOffset;

    const base = {
      map,
      strokeWeight: 1.5,
      strokeOpacity: 0.45,
      clickable: false,
      zIndex: 1,
    };

    if (this.cfg.showLat) {
      this.latBand = new win.google.maps.Rectangle({
        ...base,
        bounds: {
          north: Math.min(90, centerLat + deltaLat),
          south: Math.max(-90, centerLat - deltaLat),
          east: 179.9999,
          west: -179.9999,
        },
        strokeColor: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.32,
      }) as google.maps.Rectangle;
    }

    if (this.cfg.showLng) {
      this.lngBand = new win.google.maps.Rectangle({
        ...base,
        bounds: {
          north: 85,
          south: -85,
          east: Math.min(180, centerLng + deltaLng),
          west: Math.max(-180, centerLng - deltaLng),
        },
        strokeColor: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.32,
      }) as google.maps.Rectangle;
    }
  }
}

export const bandsManager = new BandsManager();
