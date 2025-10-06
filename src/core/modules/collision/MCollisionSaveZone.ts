import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { GameObject } from '../../common/GameObject';
import { Module } from '../../common/Module';
import { gameObjectManager } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';
import { doItemsIntersect } from '../../utils/collision/doItemsIntersect';
import { repositionObjectOnCollisionWithObject } from '../../utils/collision/repositionObjectOnCollisionWithObject';

type CollisionType = 'applyCollision' | 'onlyAfterCollision';

interface MCollisionSaveZoneParams {
  object: GameObject<Shape>;
  collisionType?: CollisionType;
  afterCollision?: (collision: Collision) => void;
}

/**
 * Represents a collision module for handling interactions with save zones.
 *
 * This module checks for intersections between its associated game object and save zones,
 * optionally applies collision effects, and triggers a callback after a collision occurs.
 *
 * @remarks
 * - The collision type can be set to `'applyCollision'` to reposition the object upon collision.
 * - The `afterCollision` callback is invoked with collision details if a collision is detected.
 *
 * @example
 * ```typescript
 * const collisionModule = new MCollisionSaveZone({
 *   object: playerObject,
 *   collisionType: 'applyCollision',
 *   afterCollision: (collision) => { }
 * });
 * ```
 */
export class MCollisionSaveZone implements Module {
  private object: GameObject<Shape>;
  private collisionType?: CollisionType;
  private afterCollision?: (collision: Collision) => void;

  constructor(params: MCollisionSaveZoneParams) {
    this.object = params.object;
    this.collisionType = params.collisionType;
    this.afterCollision = params.afterCollision;
  }

  public afterUpdate(deltaTime: number): void {
    gameObjectManager.saveZones.forEach((saveZone) => {
      const { doesIntersect, intersections } =
        this.collisionWithSaveZone.bind(this)(saveZone);

      if (this.afterCollision !== undefined && doesIntersect === true) {
        this.afterCollision(intersections);
      }
    });
  }

  private collisionWithSaveZone(saveZone: SaveZone): {
    doesIntersect: boolean;
    intersections: Collision;
  } {
    const { doesIntersect, intersections } = doItemsIntersect(
      this.object,
      saveZone
    );

    if (this.collisionType === 'applyCollision' && doesIntersect === true) {
      repositionObjectOnCollisionWithObject(
        this.object,
        saveZone,
        intersections
      );
    }

    return { doesIntersect, intersections };
  }
}
