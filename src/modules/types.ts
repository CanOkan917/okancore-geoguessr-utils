import type { ComponentType } from 'react';
import type { Coords } from '../types';

export interface Module {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  enabled: boolean;
  SettingsComponent?: ComponentType;

  init(): void;
  enable(): void;
  disable(): void;

  onCoords?(coords: Coords): void;
  onNewRound?(): void;
  onMapAdded?(map: google.maps.Map): void;
  onReset?(): void;
}
