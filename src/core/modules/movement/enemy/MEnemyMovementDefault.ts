import { MCollisionSaveZone } from '../../collision/MCollisionSaveZone';
import { MCollisionWalls } from '../../collision/MCollisionWalls';
import { Collision } from '../../../types/Collision';
import { Enemy } from '../../../../objects/enemy/enemy';
import { AMEnemyMovement } from './MEnemyMovement.type';

export class MEnemyMovementDefault implements AMEnemyMovement {
  private _enemy: Enemy;
  private _MCollisionWalls: MCollisionWalls;
  private _MCollisionSaveZone: MCollisionSaveZone;

  constructor(enemy: Enemy) {
    this._enemy = enemy;

    this._MCollisionWalls = new MCollisionWalls({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithWallsHandler.bind(this),
    });

    this._MCollisionSaveZone = new MCollisionSaveZone({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithSaveZonesHandler.bind(this),
    });
  }

  public afterUpdate(deltaTime: number): void {
    this._MCollisionWalls.afterUpdate(deltaTime);
    this._MCollisionSaveZone.afterUpdate(deltaTime);
  }

  private collisionWithWallsHandler(collision: Collision): void {
    const newVelocity = this._enemy.velocity;
    if (collision.x !== 'no') newVelocity.x *= -1;
    if (collision.y !== 'no') newVelocity.y *= -1;
    this._enemy.setVelocity = newVelocity;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    const newVelocity = this._enemy.velocity;
    if (collision.x !== 'no') newVelocity.x *= -1;
    if (collision.y !== 'no') newVelocity.y *= -1;
    this._enemy.setVelocity = newVelocity;
  }
}
