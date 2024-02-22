import { Position } from "../../types/Position";

export interface CommonDrawTextOptions {
  fillColor?: string;
  position: Position;
  fontSize?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  isBold?: boolean;
}

export interface ExtendedDrawTextOptions extends CommonDrawTextOptions {
  strokeColor: string;
  lineWidth: number;
}
const defaultOptions = {
  position: { x: 0, y: 0 },
  fillColor: "#000",
  fontSize: 16,
  textAlign: "start",
  textBaseline: "middle",
  isBold: false,
} as const;

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: CommonDrawTextOptions | ExtendedDrawTextOptions
): void {
  const { isBold, fillColor, position, fontSize, textAlign, textBaseline } = {
    ...defaultOptions,
    ...options,
  };

  ctx.fillStyle = fillColor;
  ctx.textBaseline = textBaseline;
  ctx.textAlign = textAlign;
  ctx.font = `${isBold ? "bold" : ""} ${fontSize}px sans-serif`;

  if ("strokeColor" in options) {
    const extendedOptions = options as ExtendedDrawTextOptions;
    ctx.strokeStyle = extendedOptions.strokeColor;
    ctx.lineWidth = extendedOptions.lineWidth * 2;
    ctx.strokeText(text, position.x, position.y);
  }

  ctx.fillText(text, position.x, position.y);
}
