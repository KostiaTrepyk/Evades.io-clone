import { GAMECONFIG } from '@config/game.config';
import { SAVEZONECONFIG } from '@config/saveZone.config';
import { RectangleObject, type RectangleSize } from '@core/common/RectangleObject/RectangleObject';
import type { Position } from '@shared-types/Position';
import { drawRectangle } from '@utils/canvas/drawRectangle';

export class SaveZone extends RectangleObject {
  public override renderId: number = GAMECONFIG.renderingOrder.saveZone;

  constructor(position: Position, size: RectangleSize) {
    super(position, size);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawRectangle(ctx, {
      position: this.position,
      size: { height: this.size.height, width: this.size.width },
      fill: { color: SAVEZONECONFIG.color },
    });
  }
}
