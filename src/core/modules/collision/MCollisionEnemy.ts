import { GameCollision } from '@core/collision/GameCollision';
import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { Module } from '@core/common/Module';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { gameObjectManager } from '@core/global';
import type { EnemyBase } from '@game/objects/enemyBase/enemyBase';

interface MCollisionEnemyParams {
  object: MCollisionEnemy['_object'];
  onCollision: (enemy: EnemyBase) => void;
}

/**
 * Module responsible for handling collision detection between a game object and enemies.
 *
 * When the associated game object collides with any enemy, the provided `onCollision` callback is triggered.
 *
 * @remarks
 * This module should be attached to a game object that needs to respond to collisions with enemies.
 *
 * @example
 * ```typescript
 * const collisionModule = new MCollisionEnemy({
 *   object: playerObject,
 *   onCollision: (enemy) => { }
 * });
 * ```
 *
 * @param params - The parameters required to initialize the collision module.
 * @param params.object - The game object to check for collisions.
 * @param params.onCollision - The callback to execute when a collision with an enemy occurs.
 */
export class MCollisionEnemy implements Module {
  private readonly _object: RectangleObject | CircleObject;
  private readonly _onCollision: (enemy: EnemyBase) => void;

  constructor(params: MCollisionEnemyParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    const enemies = gameObjectManager.enemies;
    enemies.forEach(enemy => {
      if (GameCollision.checkCollisions(this._object, enemy).doesCollide === true) {
        this._onCollision(enemy);
      }
    });
  }
}
