export interface Status<
  StatusName extends string,
  Effect extends Record<string, any>
> {
  /** Id по которому можно убирать не нужные эффекты не боясь убрать то что ещё нужно. */
  id: Symbol;
  /** От имени зависит цвет эффекта. */
  name: StatusName;
  effects?: Effect;
}

export interface MStatusParams<StatusName extends string> {
  availableStatusNames: readonly StatusName[];
  /** Disables all statuses and color changes.
   * @default false */
  isDisableAllStatuses?: boolean;
}

export class MStatus<
  StatusName extends string,
  Effect extends Record<string, any>
> {
  private _availableStatusNames: readonly StatusName[];
  private _statuses: Status<StatusName, Effect>[];
  private _isDisabledAllStatuses: boolean;

  constructor(params: MStatusParams<StatusName>) {
    const { availableStatusNames, isDisableAllStatuses } = params;

    this._availableStatusNames = availableStatusNames;
    this._isDisabledAllStatuses = isDisableAllStatuses || false;
    this._statuses = [];
  }

  /** Enables application of new statuses.  */
  public enable(): void {
    this._isDisabledAllStatuses = false;
  }

  /** Clears all statuses and disables the application of new statuses.  */
  public disable(): void {
    this._isDisabledAllStatuses = true;
    this._statuses = [];
  }

  get isDisabled(): boolean {
    return this._isDisabledAllStatuses;
  }

  /** Returns true if the status is applied, false otherwise. */
  public applyStatus(status: Status<StatusName, Effect>): boolean {
    if (this._isDisabledAllStatuses === true) return false;
    if (this.isAppliedStatusById(status.id)) return false;

    this._statuses.push(status);
    return true;
  }

  public removeStatus(id: Symbol): void {
    this._statuses = this._statuses.filter((status) => status.id !== id);
  }

  public isAppliedStatusById(id: Symbol): boolean {
    return Boolean(this._statuses.find((status) => status.id === id));
  }

  public isAppliedStatusByName(name: StatusName): boolean {
    return Boolean(this._statuses.find((status) => status.name === name));
  }

  // FIX ME Позволит мутировать
  public get statuses() {
    return this._statuses;
  }

  public get availableStatusNames() {
    return this._availableStatusNames;
  }
}
