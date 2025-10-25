import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';
import { LevelConfiguration } from './types';

export class Stage {
  private _levelCount: number;
  private _levelConfiguration: LevelConfiguration;

  constructor(levelCount: number, levelConfiguration: LevelConfiguration) {
    this._levelCount = levelCount;
    this._levelConfiguration = {
      ...levelConfiguration,
    };
  }

  public getLevelConfiguration(level: number): GenerateLevelOptions {
    const result: GenerateLevelOptions = {
      playerPosition: this._levelConfiguration.playerPosition || 'start',
      pointOrbCount: this._levelConfiguration.pointOrbCount,
      enemies: this._levelConfiguration.enemies,
      portals: {},
      level,
    };

    // Portals
    result.portals.nextLevel = true;
    if (level > 0) result.portals.prevLevel = true;

    if (level === 0) {
      result.portals.nextTunnel = true;
      result.portals.prevTunnel = true;
    }
    return result;
  }

  public get levelCount(): number {
    return this._levelCount;
  }
}
