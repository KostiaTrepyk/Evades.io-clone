import { doesCollideWithWalls } from '@core/collision/utils/doesCollideWithWalls';
import { repositionObjectOnCollisionWithWalls } from '@core/collision/utils/repositionObjectOnCollisionWithWalls';
import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import type { Collision } from '@shared-types/Collision';
import type { Module } from 'modules/Module';

type CollisionType = 'applyCollision' | 'onlyAfterCollision';

interface MCollisionWallsParams {
  object: MCollisionWalls['_object'];
  collisionType?: CollisionType;
  onCollision?: (collision: Collision) => void;
}

/** @important Обязательно нужно добавить в onUpdate, afterUpdate в родителе! */
/**
 * Handles collision detection and response for a game object against walls.
 *
 * This module supports two collision types:
 * - `'applyCollision'`: Applies collision logic and invokes the `afterCollision` callback if a collision occurs.
 * - `'onlyAfterCollision'`: Only checks for collision and invokes the `afterCollision` callback if a collision occurs.
 *
 * @remarks
 * The collision detection is performed during the `afterUpdate` lifecycle method.
 *
 * @example
 * ```typescript
 * const collisionWalls = new MCollisionWalls({
 *   object: playerObject,
 *   collisionType: 'applyCollision',
 *   afterCollision: (collision) => { }
 * });
 * ```
 *
 * @param params - Configuration parameters for collision handling.
 * @param params.object - The game object to check for wall collisions.
 * @param params.afterCollision - Optional callback invoked after a collision is detected.
 * @param params.collisionType - Determines the collision handling strategy.
 */
export class MCollisionWalls implements Module {
  private readonly _object: RectangleObject | CircleObject;
  private readonly _onCollision?: (collision: Collision) => void;
  private readonly _collisionType: CollisionType;

  constructor(params: MCollisionWallsParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
    this._collisionType = params.collisionType ?? 'onlyAfterCollision';
  }

  public afterUpdate(): void {
    if (this._collisionType === 'applyCollision') {
      const { collisions, doesCollide } = doesCollideWithWalls(this._object);

      repositionObjectOnCollisionWithWalls(this._object, collisions);

      if (this._onCollision && doesCollide) {
        this._onCollision(collisions);
      }

      return;
    }

    if (this._collisionType === 'onlyAfterCollision') {
      const { collisions, doesCollide } = doesCollideWithWalls(this._object);

      if (this._onCollision && doesCollide) {
        this._onCollision(collisions);
      }
    }
  }
}
