import { Position } from "../../core/types/Position";

export type CharacterModel = "default" | "dead";

export const RenderCharacterModel: Record<
  CharacterModel,
  (ctx: CanvasRenderingContext2D, position: Position, size: number) => void
> = {
  default: (ctx, position, size) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#bbb";
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
  },

  dead: (ctx, position, size) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#999";
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
  },
};
