import { gameObjectManager, renderer, uiRenderer, userInput } from './global';

export class GameLoop {
  private lastRender: number | undefined;
  private animationId: number | undefined;

  constructor() {}

  public start(): void {
    if (!this.lastRender) this.lastRender = performance.now();
    const now = performance.now();

    let deltaTime = (now - this.lastRender) / 1000;

    // updates
    gameObjectManager.updateAll(deltaTime);
    userInput.afterUpdate();

    // gameObjects render
    renderer.renderFrame((ctx) => gameObjectManager.renderAll(ctx));

    // UI render
    uiRenderer.render();

    this.lastRender = now;

    this.animationId = requestAnimationFrame(() => {
      this.start();
    });
  }

  public stop(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.lastRender = undefined;
  }
}
