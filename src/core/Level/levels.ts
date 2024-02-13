import { GenerateLevelOptions } from "./LevelGenerator";

export const defaultLevels: GenerateLevelOptions[] = [
  {
    enemyCount: 25,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 2,
    pointOrbCount: 100,
  },
  {
    enemyCount: 30,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 4,
    pointOrbCount: 100,
  },
  {
    enemyCount: 35,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 6,
    pointOrbCount: 100,
  },
  {
    enemyCount: 50,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 6,
    pointOrbCount: 100,
  },
  {
    enemyCount: 20,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 20,
    pointOrbCount: 100,
  },
];
