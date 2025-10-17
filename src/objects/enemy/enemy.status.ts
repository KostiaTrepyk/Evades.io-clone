import { MStatus } from '../../core/modules/status/MStatus';
import { HSLA } from '../../core/utils/hsla';
import { Enemy } from './enemy';

// Статусы для врагов.
// Если не могут убить - полу-прозрачные
// Если замедленные - голубой
// Уменьшенные - голубой-зелёный
// Ускоренные - жёлтый
// Увеличение - оранжевый
// Изменили передвижение в другую сторону - зелёный
// Если скорость = 0 тогда tilted (более тёмные)
const statusNames = [
  'disabled',
  'stunned',
  'speedBoost',
  'speedReduction',
  'sizeIncreased',
  'sizeReduction',
  'changeDirection',
] as const;
type StatusName = (typeof statusNames)[number];

interface Effect {
  speed?: number;
  sizeScale?: number;
}

export interface EnemyStatusParams {
  enemy: Enemy;
}

export class EnemyStatus {
  private Enemy: Enemy;
  private _sizeScale: number;
  private _speedChange: number;

  public MStatus: MStatus<StatusName, Effect>;

  constructor(params: EnemyStatusParams) {
    const { enemy } = params;

    this.MStatus = new MStatus({
      availableStatusNames: statusNames,
      isDisableAllStatuses: false,
    });

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

  public getColor(): HSLA {
    const newColor = this.Enemy.defaultColor.clone();

    const statuses = this.MStatus.statuses;
    for (let i = statuses.length - 1; i >= 0; i++) {
      const status = statuses[i];

      if (status.name === 'disabled') continue;

      if (status.name === 'sizeReduction') {
        newColor.setSaturation = 45;
        newColor.setHue = 145;
        break;
      }
      if (status.name === 'speedReduction') {
        newColor.setSaturation = 45;
        newColor.setHue = 180;
        break;
      }
      if (status.name === 'sizeIncreased') {
        newColor.setSaturation = 45;
        newColor.setHue = 45;
        break;
      }
      if (status.name === 'speedBoost') {
        newColor.setSaturation = 45;
        newColor.setHue = 60;
        break;
      }
      if (status.name === 'changeDirection') {
        newColor.setSaturation = 45;
        newColor.setHue = 110;
        break;
      }
      if (status.name === 'stunned') {
        newColor.setSaturation = 0;
        newColor.setLightness = 40;
        break;
      }
    }

    if (this.MStatus.isAppliedStatusByName('disabled')) {
      newColor.setAlpha = 0.5;
    }

    return newColor;
  }

  public get sizeScale(): number {
    return this._sizeScale;
  }

  public get speedChange(): number {
    return this._speedChange;
  }
}
