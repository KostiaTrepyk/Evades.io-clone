import { SAVEZONECONFIG } from '../../configs/saveZone.config';
import {
  RectangleObject,
  RectangleSize,
} from '../../core/common/GameObject/RectangleObject';
import { Position } from '../../core/types/Position';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';

export class SaveZone extends RectangleObject {
  public override renderId: number = 0;

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
