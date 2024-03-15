import { GenerateLevelOptions } from './LevelGenerator/LevelGenerator';
import { Stage } from './Stage';

export class Tunel {
  private _levelsToWin: number;
  private _stages: Stage[];
  private _name: string;
  private _type: string;

  constructor(
    name: string,
    levelsToWin: number,
    stages: Stage[],
    type: 'Tunel' | 'Area'
  ) {
    this._levelsToWin = levelsToWin;
    this._stages = stages;
    this._name = name;
    this._type = type;
  }

  public getlevelConfiguration(level: number): GenerateLevelOptions {
    const maxLevels = this._stages.reduce(
      (acc, stage) => acc + stage.levelCount,
      0
    );

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

  public get levelsToWin(): number {
    return this._levelsToWin;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): string {
    return this._type;
  }
}
