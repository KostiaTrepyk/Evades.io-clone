import { GameMap } from '../../core/GameMap/GameMap';
import { centralCore } from './tunnels/central-core';

export const tunnelNames = {
  CentralCore: 'Central Core',
} as const;

export const gameMap = new GameMap<typeof tunnelNames>([centralCore]);
