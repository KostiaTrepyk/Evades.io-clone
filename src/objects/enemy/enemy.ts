import { GameObject } from '../../core/common/GameObject';
import { time } from '../../core/global';
import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { EnemyCollision } from './enemy.collision';
import { Velocity } from '../../core/types/Velocity';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { ENEMYCONFIG } from '../../configs/enemies/enemy.config';

export class Enemy extends GameObject<CircleShape> {
  private collision: EnemyCollision;
  public velocity: Velocity;
  private freezeStatus: { from: number; duration: number };
  public readonly defaultColor: HSLA;
  public currentColor: HSLA;

  constructor(
    position: Position,
    size: number,
    velocity: Velocity,
    color: HSLA
  ) {
    super(position, { shape: 'circle', size });

    this.collision = new EnemyCollision(this);
    this.velocity = velocity;
    this.freezeStatus = { from: 0, duration: 0 };
    this.defaultColor = color;
    this.currentColor = color;
  }

  public override onUpdate(deltaTime: number): void {
    if (this.objectModel.shape !== 'circle') throw new Error('not implemented');

    // If freezed, don't update position
    if (this.isFreezed() === true) return;

    this.prevPosition = { x: this.position.x, y: this.position.y };

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  public override afterUpdate(deltaTime: number): void {
    this.collision.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.objectModel.shape !== 'circle') throw new Error('not implemented');

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

  public isFreezed(): boolean {
    if (
      time.getTimestamp / 1000 <
      this.freezeStatus.from + this.freezeStatus.duration
    )
      return true;
    return false;
  }

  public freeze(seconds: number): void {
    // Check prev freeze status
    if (
      this.freezeStatus.from + this.freezeStatus.duration >=
      time.getTimestamp / 1000 + seconds
    )
      return;

    this.freezeStatus.from = time.getTimestamp / 1000;
    this.freezeStatus.duration = seconds;
  }
}
