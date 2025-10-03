import { GameObject } from '../../core/common/GameObject';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';
import { Enemy } from '../enemy/enemy';
import { gameObjectManager } from '../../core/global';
import { doItemsIntersect } from '../../core/utils/collision/doItemsIntersect';
import { Velocity } from '../../core/types/Velocity';

export class Projectile extends GameObject<CircleShape> {
  public velocity: Velocity;
  private color: HSLA;
  private readonly onEnemyIntersect?: (enemy: Enemy) => void;

  constructor(
    startPosition: Projectile['position'],
    size: Projectile['objectModel']['size'],
    velocity: Projectile['velocity'],
    color: Projectile['color'],
    onEnemyIntersect?: Projectile['onEnemyIntersect']
  ) {
    super(startPosition, { shape: 'circle', size: size });

    this.velocity = velocity;
    this.color = color;
    this.onEnemyIntersect = onEnemyIntersect;
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
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, this.position, {
      size: this.objectModel.size,
      fillColor: this.color,
      fill: true,
    });
  }
}
