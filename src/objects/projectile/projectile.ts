import { GameObject } from '../../core/common/GameObject';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';
import { Enemy } from '../enemy/enemy';
import { gameObjectManager } from '../../core/global';
import { doItemsIntersect } from '../../core/utils/collision/doItemsIntersect';
import { Velocity } from '../../core/types/Velocity';
import { doWallIntersect } from '../../core/utils/collision/doWallIntersect';
import { Collision } from '../../core/types/Collision';

interface Intersection {
  enemy?: (enemy: Enemy) => void;
  wall?: (collision: Collision) => void;
}
export class Projectile extends GameObject<CircleShape> {
  public velocity: Velocity;
  private color: HSLA;
  private readonly onEnemyIntersect?: (enemy: Enemy) => void;
  private readonly onWallIntersect?: (collision: Collision) => void;

  constructor(
    startPosition: Projectile['position'],
    size: Projectile['objectModel']['size'],
    velocity: Projectile['velocity'],
    color: Projectile['color'],
    intersection: Intersection
  ) {
    super(startPosition, { shape: 'circle', size: size });

    this.velocity = velocity;
    this.color = color;
    this.onEnemyIntersect = intersection.enemy;
    this.onWallIntersect = intersection.wall;
  }

  public override onUpdate(deltaTime: number): void {
    // Если двигается в вверх и в бок то мс больше!!!
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Коллизия с врагами
    if (this.onEnemyIntersect) {
      gameObjectManager.enemies.forEach((enemy) => {
        if (doItemsIntersect(enemy, this)) {
          // FIX ME Почему-то не хочет убрать undefined хотя на него есть проверка
          if (this.onEnemyIntersect) {
            this.onEnemyIntersect(enemy);
          }
        }
      });
    }

    // Коллизия с границами
    if (this.onWallIntersect) {
      const collision = doWallIntersect(this);
      this.onWallIntersect(collision);
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, this.position, {
      size: this.objectModel.size,
      fillColor: this.color,
      fill: true,
    });
  }
}
