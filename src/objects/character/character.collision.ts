import { doItemsIntersect } from '../../core/utils/collision/doItemsIntersect';
import { gameObjectManager } from '../../core/global';
import { applyCollisionWithWalls } from '../../core/utils/collision/applyCollisionWithWalls';
import { Character } from './character';

export class CharacterCollision {
  private player: Character;

  constructor(player: Character) {
    this.player = player;
  }

  public afterUpdate(deltaTime: number): void {
    applyCollisionWithWalls(this.player);

    // Check collision
    gameObjectManager.enemies.forEach((enemy) => {
      if (doItemsIntersect(this.player, enemy)) {
        if (!this.player.isDead) {
          this.player.die();
        }
      }
    });
    gameObjectManager.pointOrbs.forEach((pointOrb) => {
      if (doItemsIntersect(this.player, pointOrb)) {
        pointOrb.delete();
        this.player.level.addPointOrb();
      }
    });
  }
}
