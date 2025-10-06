import { POINTORBCONFIG } from '../../configs/pointOrb.config';
import { GameObject } from '../../core/common/GameObject';
import { Position } from '../../core/types/Position';
import { RenderPointOrb } from './PointOrb.model';

export class PointOrb extends GameObject<'circle'> {
  private color: string;

  constructor(startPosition: Position) {
    super(startPosition, { shape: 'circle', size: POINTORBCONFIG.size });

    this.color = this.getRandomColor();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderPointOrb(ctx, this.position, this.objectModel.size, this.color);
  }

  private getRandomColor(): string {
    const colors = POINTORBCONFIG.colors;
    const onErrorColor = POINTORBCONFIG.onErrorColor;

    // Теоретически не может быть onErrorColor
    const color =
      colors.at(Math.round(Math.random() * (colors.length - 1))) ??
      onErrorColor;

    return color;
  }
}
