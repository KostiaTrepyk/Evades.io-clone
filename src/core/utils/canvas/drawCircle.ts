import { Position } from '../../types/Position';
import { HSLA } from '../hsla';

interface DrawCircleOptions {
  /** @default new HSLA(0, 0, 100, 1) */
  fillColor?: HSLA;

  /** @default new HSLA(0, 0, 100, 1) */
  strokeColor?: HSLA;

  /** @default 35 */
  size?: number;

  /** @default true */
  fill?: boolean;

  /** @default false */
  stroke?: boolean;
}

const defaultOptions: Required<DrawCircleOptions> = {
  fillColor: new HSLA(0, 0, 100, 1),
  strokeColor: new HSLA(0, 0, 100, 1),
  size: 35,
  fill: true,
  stroke: false,
};

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  position: Position,
  options?: DrawCircleOptions
): void {
  const { fillColor, strokeColor, size, fill, stroke } = {
    ...defaultOptions,
    ...options,
  };

  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  // ctx.fillStyle = color.toString();
  ctx.fillStyle = fillColor.toString();
  ctx.strokeStyle = strokeColor.toString();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
