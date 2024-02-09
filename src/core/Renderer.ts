export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById("game")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
  }

  public init() {
    this.setCanvasSize();
    window.addEventListener("resize", this.setCanvasSize.bind(this));
  }

  public render(cb: (ctx: CanvasRenderingContext2D) => void) {
    this.beforeRender();
    cb(this.ctx);
  }

  private beforeRender() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
