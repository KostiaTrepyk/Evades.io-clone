import { PointOrb } from '../../../objects/pointOrb/PointOrb';
import { CircleObject } from '../../common/CircleObject/CircleObject';
import { RectangleObject } from '../../common/RectangleObject/RectangleObject';
import { Module } from '../../common/Module';
import { gameObjectManager } from '../../global';
import { doItemsCollide } from '../../utils/collision/doItemsCollide';

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
  private _object: RectangleObject | CircleObject;
  private _onCollision: (pointOrb: PointOrb) => void;

  constructor(params: MCollisionPointOrbParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    const pointOrbs = gameObjectManager.pointOrbs;
    pointOrbs.forEach((pointOrb) => {
      if (doItemsCollide(this._object, pointOrb).doesCollide === true) {
        this._onCollision(pointOrb);
      }
    });
  }
}
