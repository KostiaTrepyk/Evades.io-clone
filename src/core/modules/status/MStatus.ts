export interface Status<
  StatusName extends string,
  Effect extends Record<string, any>
> {
  id: Symbol;
  name: StatusName;
  effects?: Effect;
}

export interface MStatusParams<StatusName extends string> {
  availableStatusNames: readonly StatusName[];
}

export class MStatus<
  StatusName extends string,
  Effect extends Record<string, any>
> {
  private _availableStatusNames: readonly StatusName[];
  private _statuses: Status<StatusName, Effect>[];

  constructor(params: MStatusParams<StatusName>) {
    const { availableStatusNames } = params;

    this._availableStatusNames = availableStatusNames;
    this._statuses = [];
  }

  // FIX ME Передаём ссылку на объект. Опасно! Но если использовать structuredClone, тогда не будет работать this.removeStatus
  public applyStatus(status: Status<StatusName, Effect>): void {
    if (this.isAppliedStatusById(status.id)) return;
    this._statuses.push(status);
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
