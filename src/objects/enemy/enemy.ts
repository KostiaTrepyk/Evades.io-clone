import { GameObject } from '../../core/common/GameObject/GameObject';
import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { Velocity } from '../../core/types/Velocity';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { ENEMYCONFIG } from '../../configs/enemies/enemy.config';
import { EnemyStatus } from './enemy.status';
import { speedPerPoint } from '../../consts/consts';
import { MEnemyMovementDefault } from '../../core/modules/movement/enemy/MEnemyMovementDefault';
import { AMEnemyMovement } from '../../core/modules/movement/enemy/MEnemyMovement.type';

export interface EnemyParams {
  position: Position;
  size: number;
  velocity: Velocity;
  color?: HSLA;
}

export class Enemy extends GameObject<CircleShape> {
  public readonly defaultColor: HSLA;
  public currentColor: HSLA;
  public readonly defaultSize: number;
  private _velocity: Velocity;

  /** Can be overridden by another enemy movement module. */
  protected EnemyMovement: AMEnemyMovement;
  public EnemyStatus: EnemyStatus;

  constructor(params: EnemyParams) {
    const { position, size, velocity, color } = params;

    super(position, { shape: 'circle', size });

    const enemyColor = color || ENEMYCONFIG.defaultColor.clone();
    this.defaultColor = enemyColor.clone();
    this.currentColor = enemyColor.clone();

    this.defaultSize = size;
    this._velocity = velocity;

    this.EnemyMovement = new MEnemyMovementDefault(this);
    this.EnemyStatus = new EnemyStatus({ enemy: this });
  }

  public override beforeUpdate(deltaTime: number): void {
    super.beforeUpdate?.(deltaTime);
    this.EnemyStatus.beforeUpdate();
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate?.(deltaTime);

    this.currentColor = this.EnemyStatus.getColor();

    // If is not freezed, update position
    if (this.EnemyStatus.MStatus.isAppliedStatusByName('stunned') === false) {
      this.prevPosition = { x: this.position.x, y: this.position.y };

      // Гениально посчитал velocity. Переделать нужно
      const defaultSpeed =
        Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
      const currentSpeed = defaultSpeed + this.EnemyStatus.speedChange;

      const currentVelocity = {
        x: (this.velocity.x / defaultSpeed) * currentSpeed,
        y: (this.velocity.y / defaultSpeed) * currentSpeed,
      };

      this.position.x += currentVelocity.x * speedPerPoint * deltaTime;
      this.position.y += currentVelocity.y * speedPerPoint * deltaTime;
    }

    this.objectModel.size = this.defaultSize * this.EnemyStatus.sizeScale;
  }

  public override afterUpdate(deltaTime: number): void {
    super.afterUpdate?.(deltaTime);
    this.EnemyMovement.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D, hue?: number): void {
    super.onRender?.(ctx);
    drawCircle(ctx, {
      position: this.position,
      size: this.objectModel.size,
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
