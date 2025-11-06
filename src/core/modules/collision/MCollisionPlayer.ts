import { GameCollision } from '@core/collision/GameCollision';
import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { Module } from '@core/common/Module';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { gameObjectManager } from '@core/global';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import type { Collision } from '@shared-types/Collision';

interface MCollisionPlayerParams {
  object: MCollisionPlayer['_object'];
  onCollision: (player: CharacterBase, collisions: Collision) => void;
}

/**
 * Module that handles collision detection between a game object and the player.
 *
 * @implements {Module}
 *
 * @property {GameObject<Shape>} object - The game object to check collisions against
 * @property {(player: Character, collisions: Collision) => void} onCollision - Callback function triggered when a collision occurs
 *
 * @example
 * ```typescript
 * const collisionModule = new MCollisionPlayer({
 *   object: someGameObject,
 *   onCollision: (player, collision) => {
 *     // Handle collision
 *   }
 * });
 * ```
 */
export class MCollisionPlayer implements Module {
  private readonly _object: RectangleObject | CircleObject;
  private readonly _onCollision: (player: CharacterBase, collisions: Collision) => void;

  constructor(params: MCollisionPlayerParams) {
    this._object = params.object;
    this._onCollision = params.onCollision;
  }

  public afterUpdate(): void {
    const player = gameObjectManager.player;

    // Do nothing if no player
    if (player === undefined) return;

    const { doesCollide, collision } = GameCollision.checkCollisions(this._object, player);

    if (doesCollide === true) this._onCollision(player, collision);
  }
}
