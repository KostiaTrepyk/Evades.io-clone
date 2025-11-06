import { doItemsCollide } from '@core/collision/doItemsCollide';
import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import type { Collision } from '@shared-types/Collision';

export interface GameCollisionResult {
  object1: RectangleObject | CircleObject;
  object2: RectangleObject | CircleObject;
  doesCollide: boolean;
  collision: Collision;
}

/**
 * Manages collision detection and caching for game objects.
 *
 * This class provides a static interface for checking collisions between rectangular
 * and circular game objects. It caches collision results to improve performance by
 * avoiding redundant collision checks within the same update cycle.
 *
 * @remarks
 * The collision cache should be cleared at the end of each game update cycle using
 * {@link GameCollision.clearCollisions} to ensure fresh collision detection in the
 * next frame.
 *
 * @example
 * ```typescript
 * // Check collision between two objects
 * const result = GameCollision.checkCollisions(player, enemy);
 * if (result.doesCollide) {
 *   // Handle collision
 * }
 * ```
 */
export class GameCollision {
  // nested WeakMap: a -> (b -> result)
  private static collisions: WeakMap<object, WeakMap<object, GameCollisionResult>> = new WeakMap();

  public static checkCollisions(
    object1: RectangleObject | CircleObject,
    object2: RectangleObject | CircleObject,
  ): GameCollisionResult {
    // fast lookup both orders
    const map1 = this.collisions.get(object1);
    if (map1) {
      const cached = map1.get(object2);
      if (cached) return cached;
    }
    const map2 = this.collisions.get(object2);
    if (map2) {
      const cached = map2.get(object1);
      if (cached) return cached;
    }

    // perform collision
    const { doesCollide, collisions } = doItemsCollide(object1, object2);
    const result: GameCollisionResult = {
      object1,
      object2,
      doesCollide,
      collision: collisions,
    };

    // cache in both directions for O(1) later lookup
    this.getInnerMap(object1).set(object2, result);
    this.getInnerMap(object2).set(object1, result);

    return result;
  }

  /** Should be called after every update */
  public static clearCollisions(): void {
    this.collisions = new WeakMap();
  }

  private static getInnerMap(obj: object): WeakMap<object, GameCollisionResult> {
    let inner = this.collisions.get(obj);
    if (!inner) {
      inner = new WeakMap();
      this.collisions.set(obj, inner);
    }
    return inner;
  }
}
