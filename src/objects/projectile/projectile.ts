import { GameObject } from '../../core/common/GameObject';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';
import { Enemy } from '../enemy/enemy';
import { gameObjectManager } from '../../core/global';
import { doItemsCollide } from '../../core/utils/collision/doItemsCollide';
import { Velocity } from '../../core/types/Velocity';
import { doesCollideWithWalls } from '../../core/utils/collision/doesCollideWithWalls';
import { Collision } from '../../core/types/Collision';

interface ProjectileCollision {
  enemy?: (enemy: Enemy) => void;
  wall?: (collision: Collision) => void;
}
export class Projectile extends GameObject<CircleShape> {
  public velocity: Velocity;
  private color: HSLA;
  private readonly onEnemyCollision?: (enemy: Enemy) => void;
  private readonly onWallCollision?: (collision: Collision) => void;

  constructor(
    startPosition: Projectile['position'],
    size: Projectile['objectModel']['size'],
    velocity: Projectile['velocity'],
    color: Projectile['color'],
    collision: ProjectileCollision
  ) {
    super(startPosition, { shape: 'circle', size: size });

    this.velocity = velocity;
    this.color = color;
    this.onEnemyCollision = collision.enemy;
    this.onWallCollision = collision.wall;
  }

  public override onUpdate(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Коллизия с врагами
    if (this.onEnemyCollision !== undefined) {
      gameObjectManager.enemies.forEach((enemy) => {
        if (doItemsCollide(enemy, this).doesCollide === true) {
          // FIX ME Почему-то не хочет убрать undefined хотя на него есть проверка
          if (this.onEnemyCollision !== undefined) {
            this.onEnemyCollision(enemy);
          }
        }
      });
    }

    // Коллизия с границами
    if (this.onWallCollision !== undefined) {
      const { collisions, doesCollide } = doesCollideWithWalls(this);
      if (doesCollide === true) this.onWallCollision(collisions);
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, {
      position: this.position,
      size: this.objectModel.size,
      fill: { color: this.color },
    });
  }
}
