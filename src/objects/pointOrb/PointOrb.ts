import { POINTORBCONFIG } from '../../configs/pointOrb.config';
import { CircleObject } from '../../core/common/CircleObject/CircleObject';
import { Position } from '../../core/types/Position';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';

export class PointOrb extends CircleObject {
  public override renderId: number = 2;
  private _color: HSLA;

  constructor(startPosition: Position) {
    super(startPosition, POINTORBCONFIG.radius);

    this._color = this.getRandomColor();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawCircle(ctx, {
      position: this.position,
      radius: this.radius,
      fill: { color: this._color },
    });
  }

  private getRandomColor(): HSLA {
    const colors = POINTORBCONFIG.colors;
    const onErrorColor = POINTORBCONFIG.onErrorColor;

    // Теоретически не может быть onErrorColor
    const color =
      colors.at(Math.round(Math.random() * (colors.length - 1))) ??
      onErrorColor;

    return color;
  }
}
