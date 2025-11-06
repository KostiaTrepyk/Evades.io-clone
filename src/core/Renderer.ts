import type { CameraController } from './CameraController';
import type { RectangleSize } from './common/RectangleObject/RectangleObject';

import { GAMECONFIG } from '@config/game.config';

export class Renderer {
  private readonly _CameraController: CameraController;
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _canvas: HTMLCanvasElement;
  private _canvasSize: RectangleSize = { width: 4000, height: 800 };

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
    this._ctx.fillRect(0, 0, this._canvasSize.width, this._canvasSize.height);

    this.drawCells(this._ctx);

    cb(this._ctx);
  }

  private adjustCanvasSizeToWindow() {
    this._ctx.canvas.width = window.innerWidth;
    this._ctx.canvas.height = window.innerHeight;
  }

  /** FIX ME Походу можно ускорить. Нужно позже подумать */
  private drawCells(ctx: CanvasRenderingContext2D) {
    const horizontalCells = this._canvasSize.width / GAMECONFIG.cellSize;
    const verticalCells = this._canvasSize.height / GAMECONFIG.cellSize;

    ctx.strokeStyle = '#ddddddff';
    ctx.lineWidth = 3;
    for (let i = 0; i < horizontalCells; i++) {
      for (let j = 0; j < verticalCells; j++) {
        const x = i * GAMECONFIG.cellSize;
        const y = j * GAMECONFIG.cellSize;
        ctx.strokeRect(x, y, GAMECONFIG.cellSize, GAMECONFIG.cellSize);
      }
    }
  }

  get canvasSize(): RectangleSize {
    return this._canvasSize;
  }

  set setCanvasSize(newCanvasSize: RectangleSize) {
    if (newCanvasSize.width < 500 || newCanvasSize.height < 300)
      console.warn('Canvas size is too small');

    this._canvasSize = { ...newCanvasSize };
  }
}
