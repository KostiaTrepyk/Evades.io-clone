import { PointOrb } from '../../../objects/pointOrb/PointOrb';
import { GameObject } from '../../common/GameObject';
import { Module } from '../../common/Module';
import { gameObjectManager } from '../../global';
import { Shape } from '../../types/Shape';
import { doItemsIntersect } from '../../utils/collision/doItemsIntersect';

interface MCollisionPointOrbParams {
  object: GameObject<Shape>;
  onCollision: (pointOrb: PointOrb) => void;
}

/**
 * Module responsible for handling collision detection between a game object and point orbs.
 *
 * When the associated game object intersects with any point orb, the provided `onCollision` callback is triggered.
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
  private object: GameObject<Shape>;
  private onCollision: (pointOrb: PointOrb) => void;

  constructor(params: MCollisionPointOrbParams) {
    this.object = params.object;
    this.onCollision = params.onCollision;
  }

  public afterUpdate(deltaTime: number): void {
    const pointOrbs = gameObjectManager.pointOrbs;
    pointOrbs.forEach((pointOrb) => {
      if (doItemsIntersect(this.object, pointOrb).doesIntersect === true) {
        this.onCollision(pointOrb);
      }
    });
  }
}
