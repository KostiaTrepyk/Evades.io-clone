import { HSLA } from "../../core/helpers/hsla";
import { Position } from "../../core/types/Position";
import { Character } from "./character";

export const RenderCharacterModel = {
  showMana: (ctx: CanvasRenderingContext2D, character: Character) => {
    const position: Position = {
      x: character.position.x - character.objectModel.size / 2,
      y: character.position.y - character.objectModel.size / 2 - 12,
    };
    const size = character.objectModel.size;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#888";
    ctx.fillStyle = "#55f";
    ctx.strokeRect(position.x, position.y, size, 8);
    ctx.fillRect(
      position.x,
      position.y,
      size * (character.energy.current / character.energy.max),
      8
    );
  },

  default: (ctx: CanvasRenderingContext2D, character: Character) => {
    const color = character.color.clone();

    switch (true) {
      case character.statuses.includes("immortal"):
        color.setLightness = 35;
        break;
      case character.statuses.includes("speedBoost"):
        color.setLightness = 70;
        break;
    }

    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      character.objectModel.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color.toString();
    ctx.fill();
  },

  dead: (ctx: CanvasRenderingContext2D, character: Character) => {
    const color = character.color.clone();
    color.setAlpha = 0.75;

    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      character.objectModel.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color.toString();
    ctx.fill();

    ctx.fillStyle = "#282828";
    ctx.font = "24px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Math.floor(character.timeToDeath || 0).toString(),
      character.position.x,
      character.position.y + 2
    );
  },

  static: (
    ctx: CanvasRenderingContext2D,
    options: {
      color: string | HSLA;
      size: number;
      position: Position;
    }
  ) => {
    ctx.beginPath();
    ctx.arc(
      options.position.x,
      options.position.y,
      options.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = options.color.toString();
    ctx.fill();
  },
} as const;
