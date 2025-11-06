import { GameCollision } from '@core/collision/GameCollision';
import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { Module } from '@core/common/Module';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { gameObjectManager } from '@core/global';
import type { PointOrb } from '@game/objects/pointOrb/PointOrb';

interface MCollisionPointOrbParams {
  object: MCollisionPointOrb['_object'];
  onCollision: (pointOrb: PointOrb) => void;
}

/**
 * Module responsible for handling collision detection between a game object and point orbs.
 *
 * When the associated game object collides with any point orb, the provided `onCollision` callback is triggered.
 *
 * @remarks
 * This module should be attached to a game object that needs to respond to collisions with point orbs.
 *
 * @example
 * ```typescript
 * const collisionModule = new MCollisionPointOrb({
 *   object: playerObject,
 *   onCollision: (pointOrb) => { }
 * });
 * ```
 *
 * @param params - The parameters required to initialize the collision module.
 * @param params.object - The game object to check for collisions.
 * @param params.onCollision - The callback to execute when a collision with an point orb occurs.
 */
export class MCollisionPointOrb implements Module {
  private readonly _object: RectangleObject | CircleObject;
  private readonly _onCollision: (pointOrb: PointOrb) => void;

  constructor(params: MCollisionPointOrbParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    const pointOrbs = gameObjectManager.pointOrbs;
    pointOrbs.forEach(pointOrb => {
      if (GameCollision.checkCollisions(this._object, pointOrb).doesCollide === true) {
        this._onCollision(pointOrb);
      }
    });
  }
}
