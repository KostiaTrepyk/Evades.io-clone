import { generateLevel } from "./LevelGenerator";
import { getStageConfiguration } from "./getStageConfiguration";

type Stages = "common" | "large" | "fast" | "many";
const levelsPerStage = 5;

export class LevelManager {
  public currentLevel: number;
  public currentStage: Stages;
  public stages: Stages[];
  public stageLevel: number;
  public difficulty: number;

  constructor(initialLevel: number = 1) {
    this.currentLevel = initialLevel;
    this.stages = ["common", "large", "fast", "many"];
    this.currentStage = "common";
    this.stageLevel = 1;
    this.difficulty = 1;

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyM") this.nextLevel();
      if (e.code === "KeyN") this.prevLevel();
    });
  }

  public start(): void {
    this.changeLevel(0, "start");
  }

  public nextLevel(): void {
    this.changeLevel(1, "start");
  }

  public prevLevel(): void {
    this.changeLevel(-1, "end");
  }

  private changeLevel(
    delta: 1 | -1 | 0,
    playerPosition: "start" | "end"
  ): void {
    if (!this.isValidLevel(this.currentLevel + delta)) return;

    this.stageLevel += delta;
    this.currentLevel += delta;
    this.currentStage = this.getLevelStage();

    const levelOptions = getStageConfiguration(
      this.difficulty * levelsPerStage * 2 + this.stageLevel * 2,
      this.currentStage
    );
    generateLevel({ ...levelOptions, playerPosition });
  }

  private getLevelStage(): Stages {
    if (this.stageLevel > levelsPerStage) {
      if (this.stages.at(1) === "common") this.difficulty++;
      this.stageLevel = 1;
      return this.getNextStage();
    }

    if (this.stageLevel < 1) {
      if (this.stages.at(0) === "common") this.difficulty--;
      this.stageLevel = levelsPerStage;
      return this.getPreviousStage();
    }

    return this.currentStage;
  }

  private getNextStage(): Stages {
    this.stages.push(this.stages[0]);
    this.stages.shift();

    const stage = this.stages[0];
    if (!stage) throw new Error("Stage not found");
    return stage;
  }

  private getPreviousStage(): Stages {
    const stage = this.stages.pop();
    if (!stage) throw new Error("Stage not found");
    this.stages.unshift(stage);
    return stage;
  }

  private isValidLevel(level: number): boolean {
    return level >= 1;
  }
}
