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

export class MCollisionPlayer implements Module {
  private object: GameObject<Shape>;
  private onCollision: (player: Character, collisions: Collision) => void;

  constructor(params: MCollisionPlayerParams) {
    this.object = params.object;
    this.onCollision = params.onCollision;
  }

  afterUpdate(deltaTime: number): void {
    const player = gameObjectManager.player;

    // Do nothing if no player
    if (player === undefined) return;

    const { doesCollide, collisions } = doItemsCollide(this.object, player);

    if (doesCollide === true) this.onCollision(player, collisions);
  }
}
