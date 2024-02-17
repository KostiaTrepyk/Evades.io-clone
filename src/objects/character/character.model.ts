import { Position } from "../../core/types/Position";

export const RenderCharacterModel = {
  showMana: (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number,
    mana: { max: number; current: number }
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#888";
    ctx.fillStyle = "#55f";
    ctx.strokeRect(position.x - size / 2, position.y - size / 2 - 12, size, 8);
    ctx.fillRect(
      position.x - size / 2,
      position.y - size / 2 - 12,
      size * (mana.current / mana.max),
      8
    );
  },

  default: (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number
  ) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#bbb";
    ctx.fill();
  },

  dead: (ctx: CanvasRenderingContext2D, position: Position, size: number) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#bbb9";
    ctx.fill();
  },
} as const;
