/** Просто время. Ничего такого. */
export class Time {
  private _timestamp: number;

  constructor() {
    this._timestamp = 0;
  }

  public onUpdate(timestamp: number): void {
    this._timestamp = timestamp;
  }

  public get timestamp(): number {
    return this._timestamp;
  }
}
