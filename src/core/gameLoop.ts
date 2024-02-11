import { camera, gameObjectManager, renderer } from "./global";

export class GameLoop {
  private lastRender: number;

  constructor() {
    this.lastRender = 0;
  }

  public start(timestamp: number): void {
    let deltaTime = (timestamp - this.lastRender) / 1000;

    // Updates
    gameObjectManager.updateAll(deltaTime);

    // Renders
    renderer.renderFrame((ctx) => {
      /* Order important */
      camera.onRender(ctx);
      gameObjectManager.renderAll(ctx);
    });

    this.lastRender = timestamp;

    requestAnimationFrame((timestamp) => {
      this.start(timestamp);
    });
  }
}
