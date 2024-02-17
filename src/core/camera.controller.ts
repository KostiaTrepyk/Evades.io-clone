import { Character } from "../objects/character/character";
import { gameObjectManager } from "./global";

const zoom = 0.85;

export class CameraController {
  public player: Character | undefined;

  constructor() {}

  public onRender(ctx: CanvasRenderingContext2D) {
    if (!this.player) {
      this.player = gameObjectManager.player;
      return;
    }

    ctx.setTransform(
      zoom,
      0,
      0,
      zoom,
      -this.player.position.x * zoom + ctx.canvas.width / 2,
      -this.player.position.y * zoom + ctx.canvas.height / 2
    );
  }
}
