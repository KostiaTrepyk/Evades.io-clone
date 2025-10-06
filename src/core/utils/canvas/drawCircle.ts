import { Position } from '../../types/Position';
import { HSLA } from '../hsla';

interface DrawCircleOptions {
  position: Position;
  size: number;
  fill?: { color: HSLA };
  stroke?: { color: HSLA; width: number };
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  options: DrawCircleOptions
): void {
  const { position, size, fill, stroke } = options;

  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);

  if (fill !== undefined) {
    ctx.fillStyle = fill.color.toString();
    ctx.fill();
  }

  if (stroke !== undefined) {
    ctx.strokeStyle = stroke.color.toString();
    ctx.lineWidth = stroke.width;
    ctx.stroke();
  }
}
