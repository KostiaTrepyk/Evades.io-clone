import { Position } from "../../core/types/Position";

const defaultFillColor = "hsl(0, 85%, 50%)";
const firstSpellFillColor = "hsl(15, 85%, 50%)";
const secondSpellFillColor = "hsl(0, 85%, 40%)";
const deadFillColor = "hsla(0, 85%, 50%, 75%)";

export const RenderMagmaxModel = {
  showMana: (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number,
    mana: { max: number; current: number }
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#99f";
    ctx.fillStyle = "#22f";
    ctx.strokeRect(
      position.x - size / 2 - 4,
      position.y - size / 2 - 12,
      size + 8,
      9
    );
    ctx.fillRect(
      position.x - size / 2 - 4,
      position.y - size / 2 - 12,
      (size + 8) * (mana.current / mana.max),
      9
    );
  },

  default: (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number,
    {
      isFirstSpellActive,
      isSecondSpellActive,
    }: { isFirstSpellActive: boolean; isSecondSpellActive: boolean }
  ) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = isFirstSpellActive
      ? firstSpellFillColor
      : isSecondSpellActive
      ? secondSpellFillColor
      : defaultFillColor;
    ctx.fill();
  },

  dead: (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number,
    timeToDeath: number
  ) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = deadFillColor;
    ctx.fill();

    ctx.fillStyle = "#282828";
    ctx.font = "24px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Math.floor(timeToDeath).toString(),
      position.x,
      position.y + 2
    );
  },
} as const;
