/** Просто время. Ничего такого. */
export class Time {
  private timestamp: number;

  constructor() {
    this.timestamp = 0;
  }

  public onUpdate(timestamp: number): void {
    this.timestamp = timestamp;
  }

  public get getTimestamp(): number {
    return this.timestamp;
  }
}
