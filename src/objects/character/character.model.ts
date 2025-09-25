import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { gameConfig } from '../../configs/game.config';
import { Character } from './character';

export const RenderCharacterModel = {
  showMana: (ctx: CanvasRenderingContext2D, character: Character) => {
    const position: Position = {
      x: character.position.x - character.objectModel.size / 2,
      y: character.position.y - character.objectModel.size / 2 - 10,
    };

    const manaBarSizeAdjustment = character.objectModel.size / 20;

    const manaBarSize = character.objectModel.size + manaBarSizeAdjustment * 2;

    const manaBarHeight = 8;
    const manaBarBorderWidth = 1;

    ctx.beginPath();
    ctx.lineWidth = manaBarBorderWidth;
    ctx.strokeStyle = gameConfig.colors.ui.mana.border;
    ctx.fillStyle = gameConfig.colors.ui.mana.fill;
    ctx.strokeRect(
      position.x - manaBarSizeAdjustment,
      position.y,
      manaBarSize,
      manaBarHeight
    );
    ctx.fillRect(
      position.x - manaBarSizeAdjustment,
      position.y,
      manaBarSize *
        (character.characteristics.energy.current /
          character.characteristics.energy.max),
      manaBarHeight
    );
  },

  default: (ctx: CanvasRenderingContext2D, character: Character) => {
    /*  const color = character.color.clone(); */

    /** Переделать */
    /* switch (true) {
      case character.characteristics.statuses.includes('immortal'):
        color.setLightness = 35;
        break;
      case character.characteristics.statuses.includes('speedBoost'):
        color.setLightness = 60;
        color.setHue = 5;
        break;
    } */

    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      character.objectModel.size / 2,
      0,
      2 * Math.PI
    );
    // ctx.fillStyle = color.toString();
    ctx.fillStyle = character.color.toString();
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

    ctx.fillStyle = '#282828';
    ctx.font = '24px cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      Math.floor(character.timeToDeath || 0).toString(),
      character.position.x,
      character.position.y + 2
    );
  },

  /** ГОВНО */
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

  drawBody: (ctx: CanvasRenderingContext2D, character: Character): void => {
    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      character.objectModel.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = character.color.toString();
    ctx.fill();
  },
} as const;
