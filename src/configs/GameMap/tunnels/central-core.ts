import { Stage } from '../../../core/GameMap/Stage';
import { Tunnel } from '../../../core/GameMap/Tunnel';
import { enemyTypes } from '../../../core/GameMap/types';
import { tunnelNames } from '../GameMapConfiguration';

const firstStage: Stage = new Stage(5, {
  pointOrbCount: 20,
  enemies: [
    {
      type: enemyTypes.CommonEnemy,
      radius: { min: 30, max: 30 },
      count: { init: 6, perLevel: 1.3, max: 56 },
      speed: { init: 2.5, perLevel: 0.145, max: 8 },
    },
    {
      type: enemyTypes.EnemyEnergyBurner,
      count: { init: 0, perLevel: 0.1, max: 4 },
      speed: { init: 6, perLevel: 0.145, max: 8 },
    },
  ],
});

const secondStage: Stage = new Stage(5, {
  pointOrbCount: 20,
  enemies: [
    {
      type: enemyTypes.CommonEnemy,
      radius: { min: 22, max: 22 },
      count: { init: 5, perLevel: 0.4, max: 8 },
      speed: { init: 8, perLevel: 0.5, max: 20 },
    },
    {
      type: enemyTypes.EnemyBorder,
      count: { init: 5, perLevel: 0.4, max: 8 },
      speed: { init: 8, perLevel: 0.5, max: 20 },
    },
  ],
});

const thirdStage: Stage = new Stage(5, {
  pointOrbCount: 20,
  enemies: [
    {
      type: enemyTypes.CommonEnemy,
      radius: { min: 15, max: 75 },
      count: { init: 5, perLevel: 1, max: 40 },
      speed: { init: 4, perLevel: 0.4, max: 7.5 },
    },
    {
      type: enemyTypes.EnemySpeedReduction,
      count: { init: 0, perLevel: 0.25, max: 8 },
      speed: { init: 2, perLevel: 0.4, max: 7.5 },
    },
  ],
});

const fourthStage: Stage = new Stage(5, {
  pointOrbCount: 20,
  enemies: [
    {
      type: enemyTypes.CommonEnemy,
      radius: { min: 30, max: 30 },
      count: { init: 50, perLevel: 2, max: 120 },
      speed: { init: 1.5, perLevel: 0.04, max: 3 },
    },
  ],
});

const centralCore = new Tunnel<typeof tunnelNames>(
  'Central Core',
  40,
  [firstStage, secondStage, thirdStage, fourthStage],
  'Area'
);

export { centralCore };
