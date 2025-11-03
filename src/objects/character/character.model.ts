import { Position } from '../../core/types/Position';
import { Character } from './character';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { drawText } from '../../core/utils/canvas/drawText';
import { CHARACTERCONFIG } from '../../configs/characters/character.config';
import { UICONFIG } from '../../configs/ui.config';

export class RenderCharacterModel {
  public static showMana(ctx: CanvasRenderingContext2D, character: Character) {
    const position: Position = {
      x: character.position.x,
      y: character.position.y - character.radius - 8,
    };

    const playerEnergy = character.characteristics.energy;

    const manaBarSizeAdjustment = character.radius / 22;
    const manaPercentage = playerEnergy.current / playerEnergy.max;

    const manaBarWidth =
      character.radius * 2 + manaBarSizeAdjustment * 2;
    const manaBarHeight = 8;
    const manaBarFillPositionX =
      position.x - manaBarWidth / 2 + (manaBarWidth / 2) * manaPercentage;

    drawRectangle(ctx, {
      position: {
        x: manaBarFillPositionX,
        y: position.y,
      },
      size: { height: manaBarHeight, width: manaBarWidth * manaPercentage },
      fill: { color: UICONFIG.colors.mana.fill },
    });
    drawRectangle(ctx, {
      position,
      size: { height: manaBarHeight, width: manaBarWidth },
      stroke: {
        color: UICONFIG.colors.mana.stroke.color,
        width: UICONFIG.colors.mana.stroke.width,
      },
    });
  }

  public static default(ctx: CanvasRenderingContext2D, character: Character) {
    drawCircle(ctx, {
      position: character.position,
      radius: character.radius,
      fill: { color: character.color.current },
    });
  }

  public static dead(ctx: CanvasRenderingContext2D, character: Character) {
    const color = character.color.current.clone();
    color.setAlpha = 0.75;

    drawCircle(ctx, {
      position: character.position,
      radius: character.radius,
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
  }
}
