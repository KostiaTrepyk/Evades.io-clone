/** Просто время. Ничего такого. */
export class Time {
  private _prevTimestamp: number;
  private _timestamp: number;
  private _deltaTime: number;

  constructor() {
    this._prevTimestamp = 0;
    this._deltaTime = 0;
    this._timestamp = 0;
  }

  public beforeAllUpdates(deltaTime: number): void {
    this._prevTimestamp = this._timestamp;
    this._timestamp += deltaTime;

    this._deltaTime = this._timestamp - this._prevTimestamp;
  }

  public get prevTimestamp(): number {
    return this._prevTimestamp;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public get deltaTime(): number {
    return this._deltaTime;
  }
}
