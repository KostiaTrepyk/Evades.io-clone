import { Position } from '../../core/types/Position';
import { GAMECONFIG } from '../../configs/game.config';
import { Character } from './character';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { drawText } from '../../core/utils/canvas/drawText';
import { CHARACTERCONFIG } from '../../configs/characters/character.config';

export const RenderCharacterModel = {
  showMana: (ctx: CanvasRenderingContext2D, character: Character) => {
    const position: Position = {
      x: character.position.x,
      y: character.position.y - character.objectModel.size / 2 - 8,
    };

    const manaBarSizeAdjustment = character.objectModel.size / 22;
    const manaPercentage =
      character.characteristics.energy.current /
      character.characteristics.energy.max;

    const manaBarWidth = character.objectModel.size + manaBarSizeAdjustment * 2;
    const manaBarHeight = 8;
    const manaBarFillPositionX =
      position.x - manaBarWidth / 2 + (manaBarWidth / 2) * manaPercentage;

    drawRectangle(ctx, {
      position: {
        x: manaBarFillPositionX,
        y: position.y,
      },
      size: { height: manaBarHeight, width: manaBarWidth * manaPercentage },
      fill: { color: GAMECONFIG.colors.ui.mana.fill },
    });
    drawRectangle(ctx, {
      position,
      size: { height: manaBarHeight, width: manaBarWidth },
      stroke: {
        color: GAMECONFIG.colors.ui.mana.stroke.color,
        width: GAMECONFIG.colors.ui.mana.stroke.width,
      },
    });
  },

  default: (ctx: CanvasRenderingContext2D, character: Character) => {
    drawCircle(ctx, {
      position: character.position,
      size: character.objectModel.size,
      fill: { color: character.color },
    });
  },

  dead: (ctx: CanvasRenderingContext2D, character: Character) => {
    const color = character.color.clone();
    color.setAlpha = 0.75;

    drawCircle(ctx, {
      position: character.position,
      size: character.objectModel.size,
      fill: { color },
    });

    const text = Math.floor(character.timeToDeath || 0).toString();

    drawText(ctx, text, {
      fill: { color: CHARACTERCONFIG.dead.text.color },
      position: { x: character.position.x, y: character.position.y + 2.5 },
      textAlign: 'center',
      textBaseline: 'middle',
      fontSize: CHARACTERCONFIG.dead.text.size,
      isBold: CHARACTERCONFIG.dead.text.isBold,
    });
  },
} as const;
