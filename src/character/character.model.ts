import { Position } from "../core/types/Position";

const characterSize = 15;

export function RenderCharacterModel(
  ctx: CanvasRenderingContext2D,
  position: Position
) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, characterSize, 0, 2 * Math.PI);
  ctx.fillStyle = "#bbb";
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}
