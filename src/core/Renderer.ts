import { cellSize } from '../consts/consts';
import { CameraController } from './CameraController';

export class Renderer {
  private camera: CameraController;

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  public _canvasSize = { x: 4000, y: 800 };

  constructor(camera: CameraController) {
    this.canvas = document.getElementById('game')! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.camera = camera;
  }

  public init() {
    this.adjustCanvasSizeToWindow();
    window.addEventListener('resize', this.adjustCanvasSizeToWindow.bind(this));
  }

  public renderFrame(cb: (ctx: CanvasRenderingContext2D) => void) {
    this.ctx.reset();

    // Set camera transform
    this.camera.onRender(this.ctx);

    // Set bgcolor
    this.ctx.fillStyle = '#ffe';
    this.ctx.fillRect(0, 0, this._canvasSize.x, this._canvasSize.y);

    this.drawCells(this.ctx);

    cb(this.ctx);
  }

  private adjustCanvasSizeToWindow() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

  /** FIX ME Походу можно ускорить. Нужно позже подумать */
  private drawCells(ctx: CanvasRenderingContext2D) {
    const horizontalCells = this._canvasSize.x / cellSize;
    const verticalCells = this._canvasSize.y / cellSize;

    ctx.strokeStyle = '#ddddddff';
    ctx.lineWidth = 3;
    for (let i = 0; i < horizontalCells; i++) {
      for (let j = 0; j < verticalCells; j++) {
        const x = i * cellSize;
        const y = j * cellSize;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }

  get canvasSize(): { x: number; y: number } {
    return this._canvasSize;
  }

  set setCanvasSize(newCanvasSize: { x: number; y: number }) {
    if (newCanvasSize.x < 500 || newCanvasSize.y < 300)
      console.warn('Canvas size si too small');

    this._canvasSize = { ...newCanvasSize };
  }
}
