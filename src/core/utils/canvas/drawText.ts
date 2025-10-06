import { Position } from '../../types/Position';
import { HSLA } from '../hsla';

export interface DrawTextOptions {
  fill?: { color: HSLA };
  stroke?: { color: HSLA; width: number };
  position: Position;
  fontSize?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  isBold?: boolean;
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: DrawTextOptions
): void {
  const { fill, stroke, position, fontSize, textAlign, textBaseline, isBold } =
    options;

  ctx.beginPath();
  ctx.font = `${isBold ? 'bold' : ''} ${fontSize}px cursive`;

  if (textBaseline !== undefined) ctx.textBaseline = textBaseline;
  if (textAlign !== undefined) ctx.textAlign = textAlign;

  if (fill !== undefined) {
    ctx.fillStyle = fill.color.toString();
    ctx.fillText(text, position.x, position.y);
  }

  if (stroke !== undefined) {
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = stroke.color.toString();
    ctx.strokeText(text, position.x, position.y);
  }
}
