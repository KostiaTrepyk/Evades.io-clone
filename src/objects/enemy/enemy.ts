import { GameObject } from '../../core/common/GameObject';
import { gameObjectManager, time } from '../../core/global';
import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { EnemyCollision } from './enemy.collision';
import { RenderEnemyModel } from './enemy.model';

export class Enemy extends GameObject<'circle'> {
  private collision: EnemyCollision;
  public velocity: { x: number; y: number };
  private freezeStatus: { from: number; duration: number };
  public color: HSLA;

  constructor(
    position: Position,
    size: number,
    velocity: { x: number; y: number }
  ) {
    super(position, { shape: 'circle', size });

    this.collision = new EnemyCollision(this);
    this.velocity = velocity;
    this.freezeStatus = { from: 0, duration: 0 };
    this.color = new HSLA(0, 0, 60, 1);
  }

  public override onUpdate(deltaTime: number): void {
    if (this.objectModel.shape !== 'circle') throw new Error('not implemented');

    // If freezed, don't update position
    if (this.isFreezed()) return;

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    this.collision.onUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.objectModel.shape !== 'circle') throw new Error('not implemented');

    RenderEnemyModel(ctx, this.position, this.objectModel.size, this.color);
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
