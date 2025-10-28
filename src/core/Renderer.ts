import { cellSize } from '../consts/consts';
import { CameraController } from './CameraController';

export class Renderer {
  private _CameraController: CameraController;
  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _canvasSize = { x: 4000, y: 800 };

  constructor(CameraController: CameraController) {
    this._CameraController = CameraController;
    this._canvas = document.getElementById('game')! as HTMLCanvasElement;
    this._ctx = this._canvas.getContext('2d')!;
  }

  public init() {
    this.adjustCanvasSizeToWindow();
    window.addEventListener('resize', this.adjustCanvasSizeToWindow.bind(this));
  }

  public renderFrame(cb: (ctx: CanvasRenderingContext2D) => void) {
    this._ctx.reset();

    // Set camera transform
    this._CameraController.onRender(this._ctx);

    // Set bg color
    this._ctx.fillStyle = '#ffe';
    this._ctx.fillRect(0, 0, this._canvasSize.x, this._canvasSize.y);

    this.drawCells(this._ctx);

    cb(this._ctx);
  }

  private adjustCanvasSizeToWindow() {
    this._ctx.canvas.width = window.innerWidth;
    this._ctx.canvas.height = window.innerHeight;
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
