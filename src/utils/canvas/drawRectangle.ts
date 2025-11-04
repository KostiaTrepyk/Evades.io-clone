import type { Position } from '@shared-types/Position';
import type { HSLA } from '@utils/hsla';

export interface DrawRectangleParams {
  position: Position;
  size: { height: number; width: number };
  fill?: { color: HSLA };
  stroke?: { color: HSLA; width: number };
}

/** Immutable function. Changes only ctx (canvas context) */
export function drawRectangle(ctx: CanvasRenderingContext2D, params: DrawRectangleParams): void {
  const { size, position, fill, stroke } = params;

  ctx.beginPath();

  if (fill !== undefined) {
    ctx.fillStyle = fill.color.toString();
    ctx.fillRect(
      position.x - size.width / 2,
      position.y - size.height / 2,
      size.width,
      size.height,
    );
  }

  if (stroke !== undefined) {
    ctx.strokeStyle = stroke.color.toString();
    ctx.lineWidth = stroke.width;
    ctx.strokeRect(
      position.x - size.width / 2,
      position.y - size.height / 2,
      size.width,
      size.height,
    );
  }
}
