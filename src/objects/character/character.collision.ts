import { doItemsIntersect } from '../../core/doItemsIntersect';
import { gameObjectManager, renderer } from '../../core/global';
import { Character } from './character';

export class CharacterCollision {
  private player: Character;

  constructor(player: Character) {
    this.player = player;
  }

  public afterUpdate(deltaTime: number): void {
    // Collision with walls
    const halfSize = this.player.objectModel.size / 2;
    const position = this.player.position;

    if (position.x - halfSize < 0) position.x = halfSize;
    else if (position.x + halfSize > renderer.canvasSize.x)
      position.x = renderer.canvasSize.x - halfSize;

    if (position.y - halfSize < 0) position.y = halfSize;
    else if (position.y + halfSize > renderer.canvasSize.y)
      position.y = renderer.canvasSize.y - halfSize;

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
