/** Просто время прохождения. Ничего такого. В Теории можно получить время между кадрами. */
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
