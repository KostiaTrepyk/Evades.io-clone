import { Character } from '../../../objects/character/character';
import { GameObject } from '../../common/GameObject/GameObject';
import { Module } from '../../common/Module';
import { gameObjectManager } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';
import { doItemsCollide } from '../../utils/collision/doItemsCollide';

interface MCollisionPlayerParams {
  object: GameObject<Shape>;
  onCollision: (player: Character, collisions: Collision) => void;
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
  private object: GameObject<Shape>;
  private onCollision: (player: Character, collisions: Collision) => void;

  constructor(params: MCollisionPlayerParams) {
    this.object = params.object;
    this.onCollision = params.onCollision;
  }

  public afterUpdate(deltaTime: number): void {
    const player = gameObjectManager.player;

    // Do nothing if no player
    if (player === undefined) return;

    const { doesCollide, collisions } = doItemsCollide(this.object, player);

    if (doesCollide === true) this.onCollision(player, collisions);
  }
}
