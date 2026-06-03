export interface Config {
  radius: number;
  enabled: boolean;
  multiRound: boolean;
  circleColor: string;
  circleOpacity: number;
  strokeColor: string;
  strokeWeight: number;
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface GameData {
  token?: string;
  id?: string;
  currentRoundNumber?: number;
  rounds: Array<{
    lat: number;
    lng: number;
    [key: string]: unknown;
  }>;
}
