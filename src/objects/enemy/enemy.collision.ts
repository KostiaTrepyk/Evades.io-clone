import { Enemy } from './enemy';
import { MCollisionWalls } from '../../core/modules/collision/MCollisionWalls';
import { Collision } from '../../core/types/Collision';
import { MCollisionSaveZone } from '../../core/modules/collision/MCollisionSaveZone';

export class EnemyCollision {
  private enemy: Enemy;
  private mCollisionWalls: MCollisionWalls;
  private mCollisionSaveZone: MCollisionSaveZone;

  constructor(enemy: Enemy) {
    this.enemy = enemy;

    this.mCollisionWalls = new MCollisionWalls({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithWallsHandler.bind(this),
    });

    this.mCollisionSaveZone = new MCollisionSaveZone({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithSaveZonesHandler.bind(this),
    });
  }

  public afterUpdate(deltaTime: number): void {
    this.mCollisionWalls.afterUpdate(deltaTime);
    this.mCollisionSaveZone.afterUpdate(deltaTime);
  }

  private collisionWithWallsHandler(collision: Collision): void {
    if (collision.x !== 'no') this.enemy.velocity.x *= -1;
    if (collision.y !== 'no') this.enemy.velocity.y *= -1;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    if (collision.x !== 'no') this.enemy.velocity.x *= -1;
    if (collision.y !== 'no') this.enemy.velocity.y *= -1;
  }
}
