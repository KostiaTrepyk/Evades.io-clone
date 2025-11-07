import type { AMEnemyMovement } from './MEnemyMovement.type';

import type { EnemyBase } from '@game/objects/enemyBase/enemyBase';
import type { Collision } from '@shared-types/Collision';
import { MCollisionSaveZone } from 'modules/collision/MCollisionSaveZone';
import { MCollisionWalls } from 'modules/collision/MCollisionWalls';

export class MEnemyMovementBorder implements AMEnemyMovement {
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

    if (collision.x === 'left') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.x === 'right') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    }
    if (collision.y === 'bottom') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.y === 'top') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    }

    this._enemy.setVelocity = newVelocity;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    const newVelocity = this._enemy.velocity;

    if (collision.x === 'left') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.x === 'right') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    }
    if (collision.y === 'bottom') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.y === 'top') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    }

    this._enemy.setVelocity = newVelocity;
  }
}
