import { Character } from "../objects/character/character";
import { gameObjectManager } from "./global";

export class CameraController {
  public player: Character | undefined;

  constructor() {}

  public onRender(ctx: CanvasRenderingContext2D) {
    if (!this.player) {
      this.player = gameObjectManager.player;
      return;
    }

    ctx.setTransform(
      1,
      0,
      0,
      1,
      -this.player.position.x + ctx.canvas.width / 2,
      -this.player.position.y + ctx.canvas.height / 2
    );
  }
}
