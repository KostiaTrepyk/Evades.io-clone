import { SAVEZONECONFIG } from '../../configs/saveZone.config';
import { GameObject } from '../../core/common/GameObject';
import { gameObjectManager } from '../../core/global';
import { Position } from '../../core/types/Position';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';

export class SaveZone extends GameObject<'rectangle'> {
  constructor(position: Position, size: { x: number; y: number }) {
    super(position, { shape: 'rectangle', size });
  }

  public override create(): void {
    gameObjectManager.addGameObject(this);
  }

  public override delete(): void {
    gameObjectManager.removeGameObject(this);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawRectangle(ctx, {
      position: this.position,
      size: { height: this.objectModel.size.y, width: this.objectModel.size.x },
      fill: { color: SAVEZONECONFIG.color },
    });
  }
}
