import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';

export class Stage {
  private _levelCount: number;
  private _levelConfiguration: Omit<GenerateLevelOptions, 'portals'>;

  constructor(
    levelCount: number,
    levelConfiguration: Omit<GenerateLevelOptions, 'portals'>
  ) {
    this._levelCount = levelCount;
    this._levelConfiguration = {
      ...levelConfiguration,
    };
  }

  public getLevelConfiguration(level: number): GenerateLevelOptions {
    const result: GenerateLevelOptions = {
      ...this._levelConfiguration,
      portals: {},
    };

    result.portals.nextLevel = true;
    if (level > 0) result.portals.prevLevel = true;

    if (level === 0) {
      result.portals.nextTunel = true;
      result.portals.prevTunel = true;
    }

    return result;
  }

  public get levelCount(): number {
    return this._levelCount;
  }
}
