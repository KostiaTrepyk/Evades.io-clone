import { POINTORBCONFIG } from '../../configs/pointOrb.config';
import { GameObject } from '../../core/common/GameObject/GameObject';
import { Position } from '../../core/types/Position';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';

export class PointOrb extends GameObject<'circle'> {
  private color: HSLA;

  constructor(startPosition: Position) {
    super(startPosition, { shape: 'circle', size: POINTORBCONFIG.size });

    this.color = this.getRandomColor();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawCircle(ctx, {
      position: this.position,
      size: this.objectModel.size,
      fill: { color: this.color },
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
