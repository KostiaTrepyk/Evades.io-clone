import { GameObject } from '../../core/common/GameObject';
import { gameObjectManager, time } from '../../core/global';
import { Position } from '../../core/types/Position';
import { EnemyCollision } from './enemy.collision';
import { RenderEnemyModel } from './enemy.model';

export class Enemy extends GameObject<'circle'> {
  private collision: EnemyCollision;
  public velocity: { x: number; y: number };
  private freezeStatus: { from: number; duration: number };

  constructor(
    position: Position,
    size: number,
    velocity: { x: number; y: number }
  ) {
    super(position, { shape: 'circle', size });

    this.collision = new EnemyCollision(this);
    this.velocity = velocity;
    this.freezeStatus = { from: 0, duration: 0 };
  }

  public override create(): void {
    gameObjectManager.addGameObject(this);
  }

  public override delete(): void {
    gameObjectManager.removeGameObject(this);
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

    RenderEnemyModel(ctx, this.position, this.objectModel.size);
  }

  public isFreezed(): boolean {
    if (
      time.getInGameTime <
      this.freezeStatus.from + this.freezeStatus.duration
    )
      return true;
    return false;
  }

  public freeze(seconds: number): void {
    // Check prev freeze status
    if (
      this.freezeStatus.from + this.freezeStatus.duration >=
      time.getInGameTime + seconds
    )
      return;

    this.freezeStatus.from = time.getInGameTime;
    this.freezeStatus.duration = seconds;
  }
}
