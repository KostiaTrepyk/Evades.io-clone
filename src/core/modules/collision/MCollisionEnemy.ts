import { Enemy } from '../../../objects/enemy/enemy';
import { CircleObject } from '../../common/CircleObject/CircleObject';
import { RectangleObject } from '../../common/RectangleObject/RectangleObject';
import { Module } from '../../common/Module';
import { gameObjectManager } from '../../global';
import { doItemsCollide } from '../../utils/collision/doItemsCollide';

interface MCollisionEnemyParams {
  object: MCollisionEnemy['_object'];
  onCollision: (enemy: Enemy) => void;
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
  private _object: RectangleObject | CircleObject;
  private _onCollision: (enemy: Enemy) => void;

  constructor(params: MCollisionEnemyParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    const enemies = gameObjectManager.enemies;
    enemies.forEach((enemy) => {
      if (doItemsCollide(this._object, enemy).doesCollide === true) {
        this._onCollision(enemy);
      }
    });
  }
}
