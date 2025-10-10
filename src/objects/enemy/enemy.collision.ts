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
    const newVelocity = this.enemy.velocity;
    if (collision.x !== 'no') newVelocity.x *= -1;
    if (collision.y !== 'no') newVelocity.y *= -1;
    this.enemy.setVelocity = newVelocity;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    const newVelocity = this.enemy.velocity;
    if (collision.x !== 'no') newVelocity.x *= -1;
    if (collision.y !== 'no') newVelocity.y *= -1;
    this.enemy.setVelocity = newVelocity;
  }
}
