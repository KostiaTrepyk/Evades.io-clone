import { GameObject } from '../../common/GameObject';
import { Module } from '../../common/Module';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';
import { applyCollisionWithWalls } from '../../utils/collision/applyCollisionWithWalls';
import { doWallIntersect } from '../../utils/collision/doWallIntersect';

type CollisionType = 'applyCollision' | 'onlyAfterCollision';

interface MCollisionWallsParams {
  object: GameObject<Shape>;
  collisionType?: CollisionType;
  afterCollision?: (collision: Collision) => void;
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
  private object: GameObject<Shape>;
  private afterCollision?: (collision: Collision) => void;
  private collisionType: CollisionType;

  constructor(params: MCollisionWallsParams) {
    this.object = params.object;
    this.afterCollision = params.afterCollision;
    this.collisionType = params.collisionType ?? 'onlyAfterCollision';
  }

  public afterUpdate(deltaTime: number): void {
    if (this.collisionType === 'applyCollision') {
      return applyCollisionWithWalls(this.object, (collision) => {
        const hasCollided = collision.x || collision.y;

        if (this.afterCollision && hasCollided) {
          this.afterCollision(collision);
        }
      });
    }

    if (this.collisionType === 'onlyAfterCollision') {
      const collision = doWallIntersect(this.object);
      const hasCollided = collision.x || collision.y;

      if (this.afterCollision && hasCollided) {
        this.afterCollision(collision);
      }
    }
  }
}
