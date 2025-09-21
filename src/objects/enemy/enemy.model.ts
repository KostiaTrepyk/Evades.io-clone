import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';

export function RenderEnemyModel(
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number,
  color: HSLA
) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color.toString();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();
}
