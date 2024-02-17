import { Position } from "../../core/types/Position";

export const RenderPointOrb = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number,
  color: string
) => {
  /* const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`; */

  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};
