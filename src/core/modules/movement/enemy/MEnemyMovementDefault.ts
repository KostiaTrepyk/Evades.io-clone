import { MCollisionSaveZone } from '../../collision/MCollisionSaveZone';
import { MCollisionWalls } from '../../collision/MCollisionWalls';
import { Collision } from '../../../types/Collision';
import { Enemy } from '../../../../objects/enemy/enemy';
import { AMEnemyMovement } from './MEnemyMovement.type';

export class MEnemyMovementDefault implements AMEnemyMovement {
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
