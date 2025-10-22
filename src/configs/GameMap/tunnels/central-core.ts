import { EnemyTypes } from '../../../core/GameMap/LevelGenerator/types';
import { Stage } from '../../../core/GameMap/Stage';
import { Tunnel } from '../../../core/GameMap/Tunnel';

const firstStage: Stage = new Stage(
  5,
  {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 6,
        size: { min: 60, max: 60 },
        speed: 2.5,
      },
      {
        type: EnemyTypes.EnemyEnergyBurner,
        count: 0,
        speed: 6,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { perLevel: 1.3, max: 56 },
      speed: { perLevel: 0.145, max: 8 },
    },
    {
      type: EnemyTypes.EnemyEnergyBurner,
      count: { perLevel: 0.1, max: 4 },
      speed: { perLevel: 0.145, max: 8 },
    },
  ]
);

const secondStage: Stage = new Stage(
  5,
  {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 5,
        size: { min: 45, max: 45 },
        speed: 8,
      },
      {
        type: EnemyTypes.EnemyBorder,
        count: 5,
        speed: 8,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { perLevel: 0.4, max: 8 },
      speed: { perLevel: 0.5, max: 20 },
    },
    {
      type: EnemyTypes.EnemyBorder,
      count: { perLevel: 0.4, max: 8 },
      speed: { perLevel: 0.5, max: 20 },
    },
  ]
);

const thirdStage: Stage = new Stage(
  5,
  {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 5,
        size: { min: 30, max: 150 },
        speed: 4,
      },
      {
        type: EnemyTypes.EnemySpeedReduction,
        count: 0,
        speed: 2,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { perLevel: 1, max: 40 },
      speed: { perLevel: 0.4, max: 7.5 },
    },
    {
      type: EnemyTypes.EnemySpeedReduction,
      count: { perLevel: 0.25, max: 8 },
      speed: { perLevel: 0.4, max: 7.5 },
    },
  ]
);

const fourthStage: Stage = new Stage(
  5,
  {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 50,
        size: { min: 60, max: 60 },
        speed: 1.5,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { perLevel: 2, max: 120 },
      speed: { perLevel: 0.04, max: 3 },
    },
  ]
);

const centralCore = new Tunnel(
  'Central Core',
  40,
  [firstStage, secondStage, thirdStage, fourthStage],
  'Area'
);

export { centralCore };
