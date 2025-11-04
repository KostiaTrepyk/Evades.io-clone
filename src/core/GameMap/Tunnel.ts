import type { GenerateLevelConfiguration } from './LevelGenerator/LevelGenerator';
import type { Stage } from './Stage';

export class Tunnel<TunnelNames extends Record<string, string>> {
  public readonly levelsToWin: number;
  private readonly _stages: Stage[];
  public readonly name: TunnelNames[keyof TunnelNames];
  public readonly type: 'Tunnel' | 'Area';

  constructor(
    name: TunnelNames[keyof TunnelNames],
    levelsToWin: number,
    stages: Stage[],
    type: 'Tunnel' | 'Area',
  ) {
    this.levelsToWin = levelsToWin;
    this._stages = stages;
    this.name = name;
    this.type = type;
  }

  public getLevelConfiguration(level: number): GenerateLevelConfiguration {
    const maxLevels = this._stages.reduce((acc, stage) => acc + stage.levelCount, 0);

    let levels = (level + 1) % maxLevels;
    let currentStage;

    for (const stage of this._stages) {
      if (stage.levelCount < levels) levels -= stage.levelCount;
      else {
        currentStage = stage;
        break;
      }
    }

    if (!currentStage) throw new Error('No stage');

    return currentStage.getLevelConfiguration(level);
  }
}
