import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { Module } from '@core/common/Module';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { gameObjectManager } from '@core/global';
import type { SaveZone } from '@game/objects/saveZone/SaveZone';
import type { Collision } from '@shared-types/Collision';
import { doItemsCollide } from '@utils/collision/doItemsCollide';
import { repositionObjectOnCollisionWithObject } from '@utils/collision/repositionObjectOnCollisionWithObject';

type CollisionType = 'applyCollision' | 'onlyAfterCollision';

interface MCollisionSaveZoneParams {
  object: MCollisionSaveZone['_object'];
  collisionType?: CollisionType;
  onCollision?: (collision: Collision) => void;
}

/**
 * Represents a collision module for handling interactions with save zones.
 *
 * This module checks for collisions between its associated game object and save zones,
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
  private readonly _object: RectangleObject | CircleObject;
  private readonly _collisionType?: CollisionType;
  private readonly _onCollision?: (collision: Collision) => void;

  constructor(params: MCollisionSaveZoneParams) {
    this._object = params.object;
    this._collisionType = params.collisionType;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    gameObjectManager.saveZones.forEach(saveZone => {
      const { doesCollide, collisions } = this.collisionWithSaveZone.bind(this)(saveZone);

      if (this._onCollision !== undefined && doesCollide === true) {
        this._onCollision(collisions);
      }
    });
  }

  private collisionWithSaveZone(saveZone: SaveZone): {
    doesCollide: boolean;
    collisions: Collision;
  } {
    const { doesCollide, collisions } = doItemsCollide(this._object, saveZone);

    if (this._collisionType === 'applyCollision' && doesCollide === true) {
      repositionObjectOnCollisionWithObject(this._object, saveZone, collisions);
    }

    return { doesCollide, collisions };
  }
}
