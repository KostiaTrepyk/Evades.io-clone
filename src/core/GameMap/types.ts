import { Character } from '../../objects/character/character';
import { Position } from '../types/Position';

export const enemyTypes = {
  CommonEnemy: 'CommonEnemy',
  EnemyEnergyBurner: 'EnemyEnergyBurner',
  EnemySpeedReduction: 'EnemySpeedReduction',
  EnemyBorder: 'EnemyBorder',
  EnemyShooter: 'EnemyShooter',
} as const;

export type EnemyType = (typeof enemyTypes)[keyof typeof enemyTypes];

export type EnemyConfiguration =
  | CommonEnemyConfiguration
  | EnemyEnergyBurnerConfiguration
  | EnemySpeedReductionConfiguration
  | EnemyBorderConfiguration
  | EnemyShooterConfiguration;

export interface CommonEnemyConfiguration {
  type: typeof enemyTypes.CommonEnemy;
  radius: { min: number; max: number };
  count: { init: number; perLevel: number; max: number };
  speed: { init: number; perLevel: number; max: number };
}

export interface EnemyEnergyBurnerConfiguration {
  type: typeof enemyTypes.EnemyEnergyBurner;
  count: { init: number; perLevel: number; max: number };
  speed: { init: number; perLevel: number; max: number };
}

export interface EnemySpeedReductionConfiguration {
  type: typeof enemyTypes.EnemySpeedReduction;
  count: { init: number; perLevel: number; max: number };
  speed: { init: number; perLevel: number; max: number };
}

export interface EnemyBorderConfiguration {
  type: typeof enemyTypes.EnemyBorder;
  count: { init: number; perLevel: number; max: number };
  speed: { init: number; perLevel: number; max: number };
}

export interface EnemyShooterConfiguration {
  type: typeof enemyTypes.EnemyShooter;
  count: { init: number; perLevel: number; max: number };
  speed: { init: number; perLevel: number; max: number };
  projectileSpeed: { init: number; perLevel: number; max: number };
  shootDistance: number;
}

export interface LevelConfiguration {
  enemies: EnemyConfiguration[];
  pointOrbCount: number;
  playerPosition?: 'start' | 'end';
  portals?: {
    position: Position;
    size: { x: number; y: number };
    onEnter: (player: Character) => void;
  }[];
  saveZones?: {
    position: Position;
    size: { x: number; y: number };
  }[];
}
