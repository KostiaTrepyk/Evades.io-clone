export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  public canvasSize = { x: 5000, y: 1000 };

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

    cb(this.ctx);

    /* Canvas border */
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#888";
    this.ctx.strokeRect(0, 0, this.canvasSize.x, this.canvasSize.y);
  }

  private beforeFrameRendering() {
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
