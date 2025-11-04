import type { Position } from '@shared-types/Position';
import type { HSLA } from '@utils/hsla';

interface DrawCircleOptions {
  position: Position;
  radius: number;
  fill?: { color: HSLA };
  stroke?: { color: HSLA; width: number };
}

export function drawCircle(ctx: CanvasRenderingContext2D, options: DrawCircleOptions): void {
  const { position, radius, fill, stroke } = options;

  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);

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
