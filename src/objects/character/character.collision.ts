import { doItemsIntersect } from "../../core/doItemsIntersect";
import { gameObjectManager, renderer } from "../../core/global";
import { Character } from "./character";

export class CharacterCollision {
  private player: Character;

  constructor(player: Character) {
    this.player = player;
  }

  public onUpdate(deltaTime: number): void {
    // Ты куда? Не убегай за екран!!!
    if (this.player.position.x < this.player.objectModel.size / 2)
      this.player.position.x = this.player.objectModel.size / 2;
    else if (
      this.player.position.x >
      renderer.canvasSize.x - this.player.objectModel.size / 2
    )
      this.player.position.x =
        renderer.canvasSize.x - this.player.objectModel.size / 2;
    if (this.player.position.y < this.player.objectModel.size / 2)
      this.player.position.y = this.player.objectModel.size / 2;
    else if (
      this.player.position.y >
      renderer.canvasSize.y - this.player.objectModel.size / 2
    )
      this.player.position.y =
        renderer.canvasSize.y - this.player.objectModel.size / 2;

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
