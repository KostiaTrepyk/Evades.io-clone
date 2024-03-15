import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';
import { EnemyTypes } from './LevelGenerator/types';

interface EnemyDifficulty {
  type: EnemyTypes;
  speed: {
    perLevel: number;
    max: number;
  };
  count: {
    perLevel: number;
    max: number;
  };
}

export class Stage {
  private _levelCount: number;
  private _defaultLevelConfiguration: Omit<GenerateLevelOptions, 'portals'>;
  private _difficulty: EnemyDifficulty[];

  constructor(
    levelCount: number,
    defaultLevelConfiguration: Omit<GenerateLevelOptions, 'portals'>,
    difficulty: EnemyDifficulty[]
  ) {
    this._levelCount = levelCount;
    this._defaultLevelConfiguration = {
      ...defaultLevelConfiguration,
    };
    this._difficulty = difficulty;
  }

  public getLevelConfiguration(level: number): GenerateLevelOptions {
    const result: GenerateLevelOptions = {
      ...structuredClone(this._defaultLevelConfiguration),
      portals: {},
    };

    // Portals
    result.portals.nextLevel = true;
    if (level > 0) result.portals.prevLevel = true;

    if (level === 0) {
      result.portals.nextTunel = true;
      result.portals.prevTunel = true;
    }

    // Enemies
    for (const enemyDifficulty of this._difficulty) {
      const enemy = result.enemies.find(
        (enemy) => enemy.type === enemyDifficulty.type
      );

      if (!enemy) continue;

      enemy.count += Math.min(
        Math.floor(enemyDifficulty.count.perLevel * level),
        enemyDifficulty.count.max
      );

      enemy.speed += Math.min(
        enemyDifficulty.speed.perLevel * level,
        enemyDifficulty.speed.max
      );
    }

    return result;
  }

  public get levelCount(): number {
    return this._levelCount;
  }
}
