import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';
import { Stage } from './Stage';

export class Tunel {
  private levelsToWin: number;
  private stages: Stage[];
  private name: string;

  constructor(name: string, levelsToWin: number, stages: Stage[]) {
    this.levelsToWin = levelsToWin;
    this.stages = stages;
    this.name = name;
  }

  public getlevelConfiguration(level: number): GenerateLevelOptions {
    const maxLevels = this.stages.reduce(
      (acc, stage) => acc + stage.getLevelCount(),
      0
    );

    let levels = level % maxLevels;
    let currentStage;

    for (const stage of this.stages) {
      if (stage.getLevelCount() < levels) levels -= stage.getLevelCount();
      else {
        currentStage = stage;
        break;
      }
    }

    if (!currentStage) throw new Error('No stage');

    return currentStage.getLevelConfiguration(level);
  }

  public getLevelsToWin(): number {
    return this.levelsToWin;
  }

  public getName(): string {
    return this.name;
  }
}
