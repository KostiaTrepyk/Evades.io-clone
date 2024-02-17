import { camera, renderer } from "./global";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  public canvasSize = { x: 4000, y: 800 };

  constructor() {
    this.canvas = document.getElementById("game")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
  }

  public init() {
    this.setCanvasSize();
    window.addEventListener("resize", this.setCanvasSize.bind(this));
  }

  public renderFrame(cb: (ctx: CanvasRenderingContext2D) => void) {
    this.beforeFrameRendering();
    // Set camera transform
    camera.onRender(this.ctx);

    // Set bgcolor
    this.ctx.fillStyle = "#ffe";
    this.ctx.fillRect(0, 0, renderer.canvasSize.x, renderer.canvasSize.y);

    this.drawCells(this.ctx);

    cb(this.ctx);
  }

  private beforeFrameRendering() {
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

  private drawCells(ctx: CanvasRenderingContext2D) {
    const cellSize = 50;
    const horizontalCells = renderer.canvasSize.x / cellSize;
    const verticalCells = renderer.canvasSize.y / cellSize;
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 3;
    for (let i = 0; i < horizontalCells; i++) {
      for (let j = 0; j < verticalCells; j++) {
        const x = i * cellSize;
        const y = j * cellSize;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }
}
