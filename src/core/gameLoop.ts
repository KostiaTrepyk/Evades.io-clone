export class GameLoop {
  private animationId: number | undefined;
  private lastRender: number = 0;

  constructor() {}

  start(
    timestamp: number,
    onUpdate: (progress: number) => void,
    onRender: (progress: number) => void
  ): void {
    let progress = (timestamp - this.lastRender) / 1000;

    onUpdate(progress);
    onRender(progress);

    this.lastRender = timestamp;
    
    this.animationId = requestAnimationFrame((timestamp) => {
      this.start(timestamp, onUpdate, onRender);
    });
  }

  /** MB bug with progress */
  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
