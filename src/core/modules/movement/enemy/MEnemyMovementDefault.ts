import type { AMEnemyMovement } from './MEnemyMovement.type';

import { MCollisionSaveZone } from '@core/modules/collision/MCollisionSaveZone';
import { MCollisionWalls } from '@core/modules/collision/MCollisionWalls';
import type { EnemyBase } from '@game/objects/enemyBase/enemyBase';
import type { Collision } from '@shared-types/Collision';

export class MEnemyMovementDefault implements AMEnemyMovement {
  private readonly _enemy: EnemyBase;
  private readonly _MCollisionWalls: MCollisionWalls;
  private readonly _MCollisionSaveZone: MCollisionSaveZone;

  constructor(enemy: EnemyBase) {
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

  public afterUpdate(): void {
    this._MCollisionWalls.afterUpdate();
    this._MCollisionSaveZone.afterUpdate();
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
