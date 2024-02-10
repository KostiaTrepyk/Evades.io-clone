import { gameObjectsManager, renderer } from "./global";

export class GameLoop {
  private lastRender: number;

  constructor() {
    this.lastRender = 0;
  }

  public start(timestamp: number): void {
    let progress = (timestamp - this.lastRender) / 1000;

    // Updates
    gameObjectsManager.player?.onUpdate(progress);
    gameObjectsManager.items.forEach((item) => {
      item.onUpdate(progress);
    });

    // Renders
    renderer.renderFrame((ctx) => {
      gameObjectsManager.player?.onRender(ctx);
      gameObjectsManager.items.forEach((item) => {
        item.onRender(ctx);
      });
    });

    this.lastRender = timestamp;

    requestAnimationFrame((timestamp) => {
      this.start(timestamp);
    });
  }
}
