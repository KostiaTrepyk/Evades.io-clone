import { Position } from "../../core/types/Position";

const characterSize = 15;

export function RenderEnemyModel(
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number
) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#faa";
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();
}
