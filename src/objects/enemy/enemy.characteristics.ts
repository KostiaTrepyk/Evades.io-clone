import { MStatus } from '../../core/modules/status/MStatus';
import { Enemy } from './enemy';

// FIX ME Нужно ещё цвет изменять!!!

// + Лучше сделать  на статусах. Сделать статусы для врагов.
// + Если не могут убить - прозрачные
// + Если замедленные, уменьшенные - голубые. Ускоренные, увеличение - красные
// ? Изменили передвижение в другую сторону - зеленые
// + Если скорость = 0 тогда tilted (более тёмные)
const statusNames = [
  'disabled',
  'stunned',
  'speedBoost',
  'speedReduction',
  'sizeIncreased',
  'sizeReduction',
] as const;
type StatusName = (typeof statusNames)[number];

interface Effect {
  speed?: number;
  sizeScale?: number;
}

export interface EnemyCharacteristicsParams {
  enemy: Enemy;
}

export class EnemyCharacteristics {
  private Enemy: Enemy;
  private _sizeScale: number;
  private _speedChange: number;

  public MStatus: MStatus<StatusName, Effect>;

  constructor(params: EnemyCharacteristicsParams) {
    const { enemy } = params;

    this.MStatus = new MStatus({ availableStatusNames: statusNames });

    this.Enemy = enemy;
    this._sizeScale = 1;
    this._speedChange = 0;
  }

  public onUpdate(): void {
    this._speedChange = this.MStatus.statuses.reduce((acc, status) => {
      if (status.effects === undefined) return acc;
      if (status.effects.speed === undefined) return acc;
      return acc + status.effects.speed;
    }, 0);

    this._sizeScale = this.MStatus.statuses.reduce((acc, status) => {
      if (status.effects === undefined) return acc;
      if (status.effects.sizeScale === undefined) return acc;
      return acc + status.effects.sizeScale;
    }, 1);
  }

  public get sizeScale(): number {
    return this._sizeScale;
  }

  public get speedChange(): number {
    return this._speedChange;
  }
}
