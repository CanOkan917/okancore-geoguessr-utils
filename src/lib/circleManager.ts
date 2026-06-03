import type { Config, Coords } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

const GUESS_KEYS = ['guess-map', 'game-layout__guess', 'guess_map'];

class CircleManager {
  private maps: google.maps.Map[] = [];
  private circle: google.maps.Circle | null = null;
  private coords: Coords | null = null;
  private cfg: Config | null = null;

  setCfg(cfg: Config): void {
    this.cfg = cfg;
  }

  setCoords(coords: Coords): void {
    this.coords = coords;
  }

  addMap(map: google.maps.Map): void {
    this.maps.push(map);
    this.tryDrawIfNeeded();
  }

  onNewRound(): void {
    if (this.cfg?.multiRound) {
      this.drop();
      this.tryDraw();
    } else if (!this.circle) {
      this.tryDraw();
    }
  }

  tryDrawIfNeeded(): void {
    if (!this.circle && this.cfg?.enabled && this.coords) {
      this.tryDraw();
    }
  }

  applyAndDraw(): void {
    if (this.coords) { this.drop(); this.tryDraw(); }
  }

  drop(): void {
    if (this.circle) { this.circle.setMap(null); this.circle = null; }
  }

  reset(): void {
    this.drop();
    this.maps = [];
    this.coords = null;
  }

  private findGuessMap(): google.maps.Map | null {
    for (const m of [...this.maps].reverse()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const div = (m as any).getDiv?.() as HTMLElement | undefined;
      if (!div?.offsetParent) continue;

      let el: HTMLElement | null = div;
      while (el && el !== document.documentElement) {
        const cls = typeof el.className === 'string' ? el.className : '';
        if (GUESS_KEYS.some(k => cls.includes(k))) return m;
        if ((el as HTMLElement).dataset?.qa === 'guess-map') return m;
        el = el.parentElement;
      }
    }

    // Fallback: most recently created visible map
    return [...this.maps].reverse().find(m => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (m as any).getDiv?.()?.offsetParent;
    }) ?? null;
  }

  private tryDraw(): void {
    if (!this.cfg?.enabled || !this.coords) return;
    const map = this.findGuessMap();
    if (!map) return;

    this.drop();
    this.circle = new win.google.maps.Circle({
      map,
      center: this.coords,
      radius: this.cfg.radius * 1000,
      fillColor: this.cfg.circleColor,
      fillOpacity: this.cfg.circleOpacity,
      strokeColor: this.cfg.strokeColor,
      strokeWeight: this.cfg.strokeWeight,
      clickable: false,
      zIndex: 1,
    }) as google.maps.Circle;
  }
}

export const circleManager = new CircleManager();
