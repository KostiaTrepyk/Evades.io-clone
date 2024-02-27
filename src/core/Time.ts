export class Time {
  private inGameTime: number;

  constructor() {
    this.inGameTime = 0;
  }

  public onUpdate(deltaTime: number): void {
    this.inGameTime += deltaTime;
  }
  
  public get getInGameTime(): number {
    return this.inGameTime;
  }
}
