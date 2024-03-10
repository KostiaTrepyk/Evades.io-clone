import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';

export class Stage {
  private levelCount: number;
  private levelConfiguration: Omit<GenerateLevelOptions, 'portals'>;

  constructor(
    levelCount: number,
    levelConfiguration: Omit<GenerateLevelOptions, 'portals'>
  ) {
    this.levelCount = levelCount;
    this.levelConfiguration = {
      ...levelConfiguration,
    };
  }

  public getLevelConfiguration(level: number): GenerateLevelOptions {
    const result: GenerateLevelOptions = {
      ...this.levelConfiguration,
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

  public getLevelCount(): number {
    return this.levelCount;
  }
}
