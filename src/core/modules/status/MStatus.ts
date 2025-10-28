import { Module } from '../../common/Module';
import { time } from '../../global';

export interface MStatusParams<StatusName extends string> {
  availableStatusNames: readonly StatusName[];
  /** Disables all statuses and color changes.
   * @default false */
  isDisableAllStatuses?: boolean;
}

export class MStatus<
  StatusName extends string,
  Effect extends Record<string, any>
> implements Module
{
  private _availableStatusNames: readonly StatusName[];
  private _statuses: Status<StatusName, Effect>[];
  private _isDisabledAllStatuses: boolean;

  constructor(params: MStatusParams<StatusName>) {
    const { availableStatusNames, isDisableAllStatuses } = params;

    this._availableStatusNames = availableStatusNames;
    this._isDisabledAllStatuses = isDisableAllStatuses || false;
    this._statuses = [];
  }

  public onUpdate(): void {
    this.statuses.forEach((status) => status.onUpdate(time.deltaTime));
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

  /** Returns true if the status is applied or refreshed, false otherwise. */
  public applyStatus(status: StatusParams<StatusName, Effect>): boolean {
    if (this._isDisabledAllStatuses === true) return false;

    // If exists
    const foundStatus = this.statuses.find((s) => s.id === status.id);
    if (foundStatus !== undefined) {
      foundStatus.refreshDuration();
      return true;
    }

    const createdStatus = new Status({
      id: status.id,
      name: status.name,
      effects: status.effects,
      MStatus: this,
      duration: status.duration,
    });

    this._statuses.push(createdStatus);
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

  get isDisabled(): boolean {
    return this._isDisabledAllStatuses;
  }
}

export interface StatusParams<
  StatusName extends string,
  Effect extends Record<string, any>
> {
  /** Id по которому можно убирать не нужные эффекты не боясь убрать то что ещё нужно. */
  id: Symbol;
  /** От имени зависит цвет эффекта. */
  name: StatusName;
  effects?: Effect;
  /** Время в секундах, сколько должен висеть данный эффект. */
  duration?: number;
}

class Status<StatusName extends string, Effect extends Record<string, any>> {
  /** Id по которому можно убирать не нужные эффекты не боясь убрать то что ещё нужно. */
  public readonly id: Symbol;
  /** От имени зависит цвет эффекта. */
  public readonly name: StatusName;
  private _effects: Effect | undefined;
  /** Время в секундах, сколько должен висеть данный эффект. */
  public readonly duration: number | undefined;
  /** Время создания эффекта. */
  private appliedAtTimeStamp: number;
  /** Ссылка на модуль что-бы получить его возможности (удалить, добавить...) */
  private MStatus: MStatus<StatusName, Effect>;

  constructor(params: {
    id: Symbol;
    name: StatusName;
    effects?: Effect;
    duration?: number;
    MStatus: MStatus<StatusName, Effect>;
  }) {
    this.id = params.id;
    this.name = params.name;
    this._effects = params.effects;
    this.duration = params.duration;
    this.MStatus = params.MStatus;

    this.appliedAtTimeStamp = time.timestamp;
  }

  public onUpdate(deltaTime: number): void {
    if (this.duration === undefined) return;
    if (time.timestamp >= this.duration + this.appliedAtTimeStamp) {
      this.MStatus.removeStatus(this.id);
    }
  }

  public refreshDuration(): void {
    this.appliedAtTimeStamp = time.timestamp;
  }

  get effects(): Effect | undefined {
    return structuredClone(this._effects);
  }
}
