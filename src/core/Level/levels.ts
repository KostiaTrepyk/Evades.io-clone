import { GenerateLevelOptions } from "./LevelGenerator";

export const defaultLevels: GenerateLevelOptions[] = [
  {
    enemyCount: 25,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 2,
    pointOrbCount: 100,
  },
  {
    enemyCount: 35,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 8,
    pointOrbCount: 100,
  },
  {
    enemyCount: 40,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 10,
    pointOrbCount: 100,
  },
  {
    enemyCount: 50,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 12,
    pointOrbCount: 100,
  },
  {
    enemyCount: 20,
    enemySize: { min: 40, max: 60 },
    enemySpeed: 20,
    pointOrbCount: 100,
  },
];
