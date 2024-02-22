import { Position } from "../../core/types/Position";

export const RenderPointOrb = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number,
  color: string
) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fill();
};
