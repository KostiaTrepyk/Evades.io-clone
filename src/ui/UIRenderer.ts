import { gameMap } from '../core/GameMap/Configuration/GameMapConfiguration';
import { drawText } from '../core/utils/canvas/drawText';
import { HSLA } from '../core/utils/hsla';
import { UICharacterDescription } from './UICharacterDescription';

export class UIRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private UICharacterDescription: UICharacterDescription;

  constructor() {
    this.canvas = document.getElementById('interface')! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.UICharacterDescription = new UICharacterDescription(this.ctx);

    window.addEventListener('resize', this.setCanvasSize.bind(this));
    this.setCanvasSize();
  }

  public render() {
    this.ctx.reset();

    this.UICharacterDescription.renderCharacterDescription();
    this.renderLevelDescription();
  }

  private renderLevelDescription() {
    const currentTunnelDetails = gameMap.getPlayerDetails();
    drawText(
      this.ctx,
      `${currentTunnelDetails.tunnel.name}: ${
        currentTunnelDetails.tunnel.type
      } ${currentTunnelDetails.currentLevel + 1}`,
      {
        fill: { color: new HSLA(0, 0, 100, 1.0) },
        stroke: { width: 3, color: new HSLA(0, 0, 40, 1) },
        fontSize: 42,
        position: { x: this.ctx.canvas.width / 2, y: 40 },
        textAlign: 'center',
        textBaseline: 'middle',
      }
    );
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
