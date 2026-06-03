import type { Module } from '../types';

const STYLE_ID = 'ogu-sv-hider';

const CSS = `
  [data-qa="panorama"],
  .panorama,
  .game-layout__panorama,
  .game-layout__panorama-container {
    visibility: hidden !important;
  }
`;

class StreetViewHiderModule implements Module {
  readonly id = 'streetViewHider';
  readonly name = 'Street View Hider';
  readonly description = 'Hide the panorama so you cannot see the location';
  enabled = false;

  init(): void {}

  enable(): void {
    this.enabled = true;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  disable(): void {
    this.enabled = false;
    document.getElementById(STYLE_ID)?.remove();
  }
}

export const streetViewHiderModule = new StreetViewHiderModule();
