import { Position } from "../../core/types/Position";

export const RenderPointOrb = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number
) => {
  /* const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`; */

  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#6b6";
  ctx.fill();
};
