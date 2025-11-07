import { EnemyBaseStatus } from './enemyBase.status';

import { ENEMYCONFIG } from '@config/enemies/enemy.config';
import { GAMECONFIG } from '@config/game.config';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { time } from '@core/global';
import type { AMEnemyMovement } from '@modules/movement/enemy/MEnemyMovement.type';
import { MEnemyMovementDefault } from '@modules/movement/enemy/MEnemyMovementDefault';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import { drawCircle } from '@utils/canvas/drawCircle';
import type { HSLA } from '@utils/hsla';

export interface EnemyParams {
  position: Position;
  radius: number;
  velocity: Velocity;
  color?: HSLA;
}

export class EnemyBase extends CircleObject {
  public override renderId: number = GAMECONFIG.renderingOrder.enemy;

  public readonly defaultColor: HSLA;
  public currentColor: HSLA;
  public readonly defaultSize: number;
  private _velocity: Velocity;

  /** Can be overridden by another enemy movement module. */
  protected EnemyMovement: AMEnemyMovement;
  public EnemyStatus: EnemyBaseStatus;

  constructor(params: EnemyParams) {
    const { position, radius, velocity, color } = params;

    super(position, radius);

    const enemyColor = color || ENEMYCONFIG.defaultColor.clone();
    this.defaultColor = enemyColor.clone();
    this.currentColor = enemyColor.clone();

    this.defaultSize = radius;
    this._velocity = velocity;

    this.EnemyMovement = new MEnemyMovementDefault(this);
    this.EnemyStatus = new EnemyBaseStatus({ enemy: this });
  }

  public override beforeUpdate(): void {
    super.beforeUpdate?.();
    this.EnemyStatus.beforeUpdate();
  }

  public override onUpdate(): void {
    super.onUpdate?.();
    this.EnemyStatus.onUpdate();

    this.currentColor = this.EnemyStatus.getColor();

    // If is not freezed, update position
    if (this.EnemyStatus.MStatus.isAppliedStatusByName('stunned') === false) {
      this.prevPosition = { x: this.position.x, y: this.position.y };

      // Гениально посчитал velocity. Переделать нужно
      const defaultSpeed = Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
      const currentSpeed = defaultSpeed + this.EnemyStatus.speedChange;

      const currentVelocity = {
        x: (this.velocity.x / defaultSpeed) * currentSpeed,
        y: (this.velocity.y / defaultSpeed) * currentSpeed,
      };

      this.position.x += currentVelocity.x * GAMECONFIG.speedPerPoint * time.deltaTime;
      this.position.y += currentVelocity.y * GAMECONFIG.speedPerPoint * time.deltaTime;
    }

    this.radius = this.defaultSize * this.EnemyStatus.sizeScale;
  }

  public override afterUpdate(): void {
    super.afterUpdate?.();
    this.EnemyMovement.afterUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawCircle(ctx, {
      position: this.position,
      radius: this.radius,
      fill: { color: this.currentColor },
      stroke: {
        color: ENEMYCONFIG.strokeColor,
        width: ENEMYCONFIG.strokeWidth,
      },
    });
  }

  public set setVelocity(v: Velocity) {
    this._velocity = v;
  }

  public get velocity(): Velocity {
    return { ...this._velocity };
  }

  /** Alias for Enemy.EnemyStatus.MStatus.isDisabled */
  get isStatusesDisabled(): boolean {
    return this.EnemyStatus.MStatus.isDisabled;
  }
}
