import { GenerateLevelOptions, generateLevel } from "./LevelGenerator";
import { defaultLevels } from "./levels";

export class LevelManager {
  private currentLevel: number;
  private levels: GenerateLevelOptions[];

  constructor(initialLevel: number = 0) {
    this.currentLevel = initialLevel;
    this.levels = defaultLevels;
  }

  public start(): void {
    this.generateLevel("start");
  }

  public nextLevel(): void {
    this.changeLevel(1, "start");
  }

  public prevLevel(): void {
    this.changeLevel(-1, "end");
  }

  private changeLevel(delta: number, playerPosition: "start" | "end"): void {
    if (!this.isValidLevel(this.currentLevel + delta)) return;

    this.currentLevel += delta;
    this.generateLevel(playerPosition);
  }

  private generateLevel(playerPosition: "start" | "end"): void {
    if (!this.isValidLevel(this.currentLevel)) return;

    const levelOptions = this.levels[this.currentLevel];
    generateLevel({ ...levelOptions, playerPosition });
  }

  private isValidLevel(level: number): boolean {
    return level >= 0 && level < this.levels.length;
  }
}
