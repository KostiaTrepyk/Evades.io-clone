import { EnemyTypes } from '../../LevelGenerator/types';
import { Stage } from '../../Stage';
import { Tunel } from '../../Tunel';

const firstStage: Stage = new Stage(
  5,
  {
    pointOrbCount: 20,
    enemies: [
      {
        type: EnemyTypes.CommonEnemy,
        count: 15,
        size: { min: 60, max: 60 },
        speed: 12,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { max: 10, perLevel: 0.5 },
      speed: { perLevel: 0.5, max: 15 },
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
        count: 10,
        size: { min: 45, max: 45 },
        speed: 15,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { max: 10, perLevel: 0.5 },
      speed: { perLevel: 0.75, max: 22 },
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
        count: 20,
        size: { min: 30, max: 100 },
        speed: 10,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { max: 10, perLevel: 0.25 },
      speed: { perLevel: 0.4, max: 15 },
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
        speed: 4,
      },
    ],
  },
  [
    {
      type: EnemyTypes.CommonEnemy,
      count: { max: 10, perLevel: 0.5 },
      speed: { perLevel: 0.5, max: 10 },
    },
  ]
);

const centralCore = new Tunel(
  'Central Core',
  40,
  [firstStage, secondStage, thirdStage, fourthStage],
  'Area'
);

export { centralCore };
