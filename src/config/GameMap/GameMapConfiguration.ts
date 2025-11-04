import { centralCore } from './tunnels/central-core';

import { GameMap } from '@core/GameMap/GameMap';

export const tunnelNames = {
  CentralCore: 'Central Core',
} as const;

export const gameMap = new GameMap<typeof tunnelNames>([centralCore]);
