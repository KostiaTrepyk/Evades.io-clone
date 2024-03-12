import { GameMap } from './GameMap';
import { EnemyTypes } from './LevelGenerator/types';
import { Stage } from './Stage';
import { Tunel } from './Tunel';

// Common Tunel
const commonTunelStages: Stage[] = [
  new Stage(2, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 25,
        size: { min: 60, max: 60 },
        speed: 14,
      },
    ],
  }),
  new Stage(4, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 50,
        size: { min: 60, max: 60 },
        speed: 4,
      },
    ],
  }),
  new Stage(2, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 15,
        size: { min: 100, max: 300 },
        speed: 6,
      },
    ],
  }),
];
const commonTunel = new Tunel('Central Core', 40, commonTunelStages, 'Area');

// Seccond Tunel
const secondTunelStages: Stage[] = [
  new Stage(1, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 20,
        size: { min: 30, max: 30 },
        speed: 15,
      },
    ],
  }),
  new Stage(1, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 50,
        size: { min: 50, max: 50 },
        speed: 4,
      },
    ],
  }),
  new Stage(1, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 15,
        size: { min: 100, max: 300 },
        speed: 6,
      },
    ],
  }),
];
const secondTunel = new Tunel('Second Tunel', 20, secondTunelStages, 'Tunel');

// Third Tunel
const thirdTunelStages: Stage[] = [
  new Stage(2, {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 80,
        size: { min: 20, max: 20 },
        speed: 12,
      },
      {
        type: EnemyTypes.EnemyEnergyBurner,
        count: 5,
        speed: 10,
      },
    ],
  }),
];
const thirdTunel = new Tunel('Third Tunel', 5, thirdTunelStages, 'Tunel');

export const gameMap = new GameMap([commonTunel, secondTunel, thirdTunel]);
