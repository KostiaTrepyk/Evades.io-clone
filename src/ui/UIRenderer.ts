import { gameMap } from '../configs/GameMap/GameMapConfiguration';
import { drawText } from '../core/utils/canvas/drawText';
import { HSLA } from '../core/utils/hsla';
import { UICharacterDescription } from './UICharacterDescription';

export class UIRenderer {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _UICharacterDescription: UICharacterDescription;

  constructor() {
    this._canvas = document.getElementById('interface')! as HTMLCanvasElement;
    this._ctx = this._canvas.getContext('2d')!;

    this._UICharacterDescription = new UICharacterDescription(this._ctx);

    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  public render() {
    this._ctx.reset();

    this._UICharacterDescription.renderCharacterDescription();
    this.renderLevelDescription();
  }

  private renderLevelDescription() {
    const currentTunnelDetails = gameMap.getPlayerPositionOnMap();
    drawText(
      this._ctx,
      `${currentTunnelDetails.tunnel.name}: ${
        currentTunnelDetails.tunnel.type
      } ${currentTunnelDetails.currentLevel + 1}`,
      {
        fill: { color: new HSLA(0, 0, 100, 1.0) },
        stroke: { width: 3, color: new HSLA(0, 0, 40, 1) },
        fontSize: 42,
        position: { x: this._ctx.canvas.width / 2, y: 40 },
        textAlign: 'center',
        textBaseline: 'middle',
      }
    );
  }

  private resizeCanvas() {
    this._ctx.canvas.width = window.innerWidth;
    this._ctx.canvas.height = window.innerHeight;
  }
}
