import { renderer } from "./global";

let uniqueid = 1;

export class GameLoop {
  private animationId: number | undefined;
  private lastRender: number;

  private updates: Update[];
  private renders: Render[];

  constructor() {
    this.lastRender = 0;
    this.updates = [];
    this.renders = [];
  }

  public start(timestamp: number): void {
    let progress = (timestamp - this.lastRender) / 1000;

    console.log(this.updates, this.renders);

    this.updates.forEach((update) => update.cb(progress));
    renderer.renderFrame((ctx) => {
      this.renders.forEach((render) => render.cb(progress, ctx));
    });

    this.lastRender = timestamp;

    this.animationId = requestAnimationFrame((timestamp) => {
      this.start(timestamp);
    });
  }

  public addOnUpdate(cb: (progress: number) => void): number {
    const id = uniqueid++;
    this.updates.push({ id, cb });
    return id;
  }
  public removeOnUpdate(id: number): void {
    this.updates = this.updates.filter((update) => update.id !== id);
  }

  public addOnRender(
    cb: (progress: number, ctx: CanvasRenderingContext2D) => void
  ): number {
    const id = uniqueid++;
    this.renders.push({ id, cb });
    return id;
  }
  public removeOnRender(id: number): void {
    this.renders = this.renders.filter((render) => render.id !== id);
  }
}

interface Update {
  id: number;
  cb: (progress: number) => void;
}

interface Render {
  id: number;
  cb: (progress: number, ctx: CanvasRenderingContext2D) => void;
}
