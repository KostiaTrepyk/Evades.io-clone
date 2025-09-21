import { gameObjectManager } from './global';
import { Position } from './types/Position';

const zoom = 0.85;

export class CameraController {
  constructor() {}

  public onRender(ctx: CanvasRenderingContext2D) {
    const player = gameObjectManager.player;

    if (player) this.setTransform(ctx, player.position, zoom);
    else this.setTransform(ctx, { x: 0, y: 0 }, zoom);
  }

  private setTransform(
    ctx: CanvasRenderingContext2D,
    position: Position,
    zoom: number
  ): void {
    ctx.setTransform(
      zoom,
      0,
      0,
      zoom,
      -position.x * zoom + ctx.canvas.width / 2,
      -position.y * zoom + ctx.canvas.height / 2
    );
  }
}
