import { GameObject } from '../../core/common/GameObject';
import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { EnemyCollision } from './enemy.collision';
import { Velocity } from '../../core/types/Velocity';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { ENEMYCONFIG } from '../../configs/enemies/enemy.config';
import { EnemyCharacteristics } from './enemy.characteristics';
import { speedPerPoint } from '../../consts/consts';

export class Enemy extends GameObject<CircleShape> {
  public readonly defaultColor: HSLA;
  public currentColor: HSLA;
  public readonly defaultSize: number;
  private _velocity: Velocity;

  private Collision: EnemyCollision;
  public Characteristics: EnemyCharacteristics;

  constructor(
    position: Position,
    size: number,
    velocity: Velocity,
    color: HSLA
  ) {
    super(position, { shape: 'circle', size });

    this.defaultColor = color;
    this.currentColor = color;
    this.defaultSize = size;
    this._velocity = velocity;

    this.Collision = new EnemyCollision(this);
    this.Characteristics = new EnemyCharacteristics({ enemy: this });
  }

  public override onUpdate(deltaTime: number): void {
    this.Characteristics.onUpdate();

    // If is not freezed, update position
    if (
      this.Characteristics.MStatus.isAppliedStatusByName('stunned') === false
    ) {
      this.prevPosition = { x: this.position.x, y: this.position.y };

      // Гениально посчитал velocity. Переделать нужно
      const defaultSpeed =
        Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
      const currentSpeed = defaultSpeed + this.Characteristics.speedChange;

      const currentVelocity = {
        x: (this.velocity.x / defaultSpeed) * currentSpeed,
        y: (this.velocity.y / defaultSpeed) * currentSpeed,
      };

      this.position.x += currentVelocity.x * speedPerPoint * deltaTime;
      this.position.y += currentVelocity.y * speedPerPoint * deltaTime;
    }

    this.objectModel.size = this.defaultSize * this.Characteristics.sizeScale;
  }

  public override afterUpdate(deltaTime: number): void {
    this.Collision.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
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

  /*   public isFreezed(): boolean {
    if (
      time.timestamp / 1000 <
      this.freezeStatus.from + this.freezeStatus.duration
    )
      return true;
    return false;
  }

  public freeze(seconds: number): void {
    // Check prev freeze status
    if (
      this.freezeStatus.from + this.freezeStatus.duration >=
      time.timestamp / 1000 + seconds
    )
      return;

    this.freezeStatus.from = time.timestamp / 1000;
    this.freezeStatus.duration = seconds;
  } */
}
