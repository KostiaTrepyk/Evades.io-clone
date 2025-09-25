/** Просто время прохождения. Ничего такого. В Теории можно получить время между кадрами. */
export class Time {
  private timeStamp: number;

  constructor() {
    this.timeStamp = 0;
  }

  public onUpdate(deltaTime: number): void {
    // TODO Вопрос насколько это точное время???
    this.timeStamp += deltaTime;
  }

  public get getTimeStamp(): number {
    return this.timeStamp;
  }
}
