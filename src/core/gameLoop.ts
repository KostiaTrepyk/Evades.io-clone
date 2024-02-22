import { gameObjectManager, renderer, uiRenderer } from "./global";

export class GameLoop {
  private lastRender: number | undefined;
  private animationId: number = 0;

  constructor() {}

  public start(): void {
    if (!this.lastRender) this.lastRender = performance.now();
    const now = performance.now();

    let deltaTime = (now - this.lastRender) / 1000;

    gameObjectManager.updateAll(deltaTime);
    renderer.renderFrame((ctx) => gameObjectManager.renderAll(ctx));
    uiRenderer.render();

    this.lastRender = now;

    this.animationId = requestAnimationFrame(() => {
      this.start();
    });
  }

  public stop(): void {
    cancelAnimationFrame(this.animationId);
    this.lastRender;
    this.lastRender = undefined;
  }
}
