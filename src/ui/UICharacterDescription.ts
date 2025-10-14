import { speedPerPoint } from '../consts/consts';
import { gameObjectManager } from '../core/global';
import { Position } from '../core/types/Position';
import { drawCircle } from '../core/utils/canvas/drawCircle';
import { drawText, DrawTextOptions } from '../core/utils/canvas/drawText';
import { HSLA } from '../core/utils/hsla';
import { Character } from '../objects/character/character';

type Section = {
  width: number;
  draw?: (ctx: CanvasRenderingContext2D, centeredPosition: Position) => void;
};

export class UICharacterDescription {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public renderCharacterDescription() {
    const player = gameObjectManager.player;
    if (!player) return;

    const barHeight = 120;
    const defaultSectionWidth = 120;
    const text = {
      fontSize: { main: 26, secondary: 14, t: 14 },
    };

    const drawTextOptions: Omit<DrawTextOptions, 'position' | 'fontSize'> = {
      fill: { color: new HSLA(0, 0, 100, 1) },
      stroke: { width: 0.5, color: new HSLA(0, 0, 27, 1) },
      isBold: false,
      textAlign: 'center',
      textBaseline: 'middle',
    };

    const characterLevelSection: Section = {
      width: defaultSectionWidth + 100,
      draw: (ctx, centeredPosition) => {
        drawCircle(ctx, {
          position: centeredPosition,
          size: 65,
          fill: { color: player.UIColor },
        });
        drawText(ctx, player.level.currentLevel.toString(), {
          position: { x: centeredPosition.x, y: centeredPosition.y + 3 },
          fontSize: 36,
          ...drawTextOptions,
        });

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333';
        ctx.moveTo(
          centeredPosition.x + (barHeight + 20) / 2,
          centeredPosition.y - barHeight / 2
        );
        ctx.lineTo(
          centeredPosition.x + (barHeight + 20) / 2,
          centeredPosition.y + barHeight / 2
        );
        ctx.stroke();
      },
    };

    const speedSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        // Draw points
        if (player.level.upgradePoints > 0) {
          drawText(ctx, `Points: ${player.level.upgradePoints}`, {
            position: {
              x: centeredPosition.x - barHeight / 2 + 4,
              y: centeredPosition.y - barHeight / 2 + 20,
            },
            fontSize: 16,
            fill: { color: new HSLA(0, 0, 100, 1) },
            textAlign: 'start',
          });
        }

        drawText(
          ctx,
          (player.characteristics.getSpeed / speedPerPoint).toFixed(1),
          {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: text.fontSize.main,
            ...drawTextOptions,
          }
        );
        drawText(ctx, 'Speed', {
          position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
          fontSize: text.fontSize.secondary,
          ...drawTextOptions,
        });

        if (
          player.level.upgradePoints > 0 &&
          player.level.upgrades.speed.current < player.level.upgrades.speed.max
        ) {
          this.drawUpgradeHelper(ctx, {
            hint: '1',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t,
          });
        }
      },
    };

    const energySection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        drawText(
          ctx,
          `${player.characteristics.getEnergy.current.toFixed(0)}/${
            player.characteristics.getEnergy.max
          }`,
          {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: text.fontSize.main,
            ...drawTextOptions,
          }
        );
        drawText(ctx, 'Energy', {
          position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
          fontSize: text.fontSize.secondary,
          ...drawTextOptions,
        });

        if (
          player.level.upgradePoints > 0 &&
          player.level.upgrades.maxEnergy.current <
            player.level.upgrades.maxEnergy.max
        ) {
          this.drawUpgradeHelper(ctx, {
            hint: '2',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t,
          });
        }
      },
    };

    const regenerationSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        drawText(
          ctx,
          player.characteristics.getEnergy.regeneration.toFixed(1),
          {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: text.fontSize.main,
            ...drawTextOptions,
          }
        );
        drawText(ctx, 'Regen', {
          position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
          fontSize: text.fontSize.secondary,
          ...drawTextOptions,
        });

        if (
          player.level.upgradePoints > 0 &&
          player.level.upgrades.energyRegeneration.current <
            player.level.upgrades.energyRegeneration.max
        ) {
          this.drawUpgradeHelper(ctx, {
            hint: '3',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t,
          });
        }
      },
    };

    const firstSkillSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        if (!player.firstSkill) return;

        drawText(ctx, player.level.upgrades.firstSpell.current.toString(), {
          position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
          fontSize: 26,
          ...drawTextOptions,
        });
        drawText(ctx, (player.firstSkill.cooldownPercentage * 100).toFixed(0), {
          position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
          fontSize: 12,
          ...drawTextOptions,
        });
        this.drawSkillPoints(
          ctx,
          {
            x: centeredPosition.x,
            y: centeredPosition.y - barHeight / 2 + 20,
          },
          player.level.upgrades.firstSpell.current
        );

        if (
          player.level.upgradePoints > 0 &&
          player.level.upgrades.firstSpell.current <
            player.level.upgrades.firstSpell.max
        ) {
          this.drawUpgradeHelper(ctx, {
            hint: '4',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t,
          });
        } else if (player.level.upgrades.firstSpell.current > 0) {
          this.drawUseHelper(ctx, {
            hint: '[ J ]',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t + 1,
          });
        }
      },
    };

    const secondSkillSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        if (!player.secondSkill) return;

        drawText(ctx, player.level.upgrades.secondSpell.current.toString(), {
          position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
          fontSize: 26,
          ...drawTextOptions,
        });
        drawText(
          ctx,
          (player.secondSkill.cooldownPercentage * 100).toFixed(0),
          {
            position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
            fontSize: 12,
            ...drawTextOptions,
          }
        );
        this.drawSkillPoints(
          ctx,
          {
            x: centeredPosition.x,
            y: centeredPosition.y - barHeight / 2 + 20,
          },
          player.level.upgrades.secondSpell.current
        );

        if (
          player.level.upgradePoints > 0 &&
          player.level.upgrades.secondSpell.current <
            player.level.upgrades.secondSpell.max
        ) {
          this.drawUpgradeHelper(ctx, {
            hint: '5',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t,
          });
        } else if (player.level.upgrades.secondSpell.current > 0) {
          this.drawUseHelper(ctx, {
            hint: '[ K ]',
            position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
            fontSize: text.fontSize.t + 1,
          });
        }
      },
    };

    const sections: Section[] = [
      characterLevelSection,
      speedSection,
      energySection,
      regenerationSection,
      firstSkillSection,
      secondSkillSection,
    ];

    const barWidth = sections.reduce(
      (acc, section) => (acc += section.width),
      0
    );
    const barPosition: Position = {
      x: (this.ctx.canvas.width - barWidth) / 2,
      y: this.ctx.canvas.height - barHeight,
    };

    const drawSection = (section: Section) => {
      const sectionId = sections.indexOf(section);

      const position: Position = { ...barPosition };

      for (let i = 0; i < sectionId; i++) {
        const element = sections.at(i);

        if (element) position.x += element.width;
        else throw new Error('Section does not exist');
      }

      if (section.draw) {
        const centeredPosition = {
          x: position.x + section.width / 2,
          y: position.y + barHeight / 2,
        };
        section.draw(this.ctx, centeredPosition);
      }
    };

    // bg color
    this.ctx.fillStyle = '#000d';
    this.ctx.fillRect(barPosition.x, barPosition.y, barWidth, barHeight);

    // Draw Exp bar
    this.drawExpBar(this.ctx, {
      player,
      position: barPosition,
      barWidth,
      value: player.level.atePointOrbs,
      maxValue: player.level.levelUpReq(),
    });

    // Draw Sections
    sections.forEach(drawSection);
  }

  public drawExpBar(
    ctx: CanvasRenderingContext2D,
    params: {
      position: Position;
      value: number;
      maxValue: number;
      player: Character;
      barWidth: number;
    }
  ): void {
    const { player, barWidth, position, value, maxValue } = params;
    const expBarHeight = 20;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '000d';
    ctx.fillStyle = player.UIColor.toString();
    ctx.fillRect(
      position.x,
      position.y - expBarHeight,
      barWidth * (value / maxValue),
      expBarHeight
    );
    ctx.strokeRect(
      position.x + 1,
      position.y - expBarHeight,
      barWidth - 2,
      expBarHeight
    );
  }

  public drawUpgradeHelper(
    ctx: CanvasRenderingContext2D,
    params: { hint: string; position: Position; fontSize: number }
  ): void {
    const { position, fontSize, hint } = params;
    const rectangleSize = 20;

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.roundRect(
      position.x - rectangleSize / 2,
      position.y - rectangleSize / 2,
      rectangleSize,
      rectangleSize,
      2
    );
    ctx.fill();
    drawText(ctx, hint, {
      position,
      fontSize,
      fill: { color: new HSLA(0, 0, 0, 1) },
      isBold: true,
      textAlign: 'center',
      textBaseline: 'middle',
    });
  }

  public drawUseHelper(
    ctx: CanvasRenderingContext2D,
    params: { hint: string; position: Position; fontSize: number }
  ): void {
    const { position, fontSize, hint } = params;
    drawText(ctx, hint, {
      position,
      fontSize,
      fill: { color: new HSLA(0, 0, 93, 1.0) },
      isBold: true,
      textAlign: 'center',
      textBaseline: 'middle',
    });
  }

  public drawSkillPoints(
    ctx: CanvasRenderingContext2D,
    position: Position,
    count: number
  ): void {
    let i = -2;
    Array(5)
      .fill(1)
      .forEach(() => {
        drawCircle(ctx, {
          position: { x: position.x + 15 * i, y: position.y },
          size: 10,
          stroke: { color: new HSLA(0, 0, 40, 1), width: 2 },
        });
        i++;
      });
    i = -2;
    Array(count)
      .fill(1)
      .forEach(() => {
        drawCircle(ctx, {
          position: { x: position.x + 15 * i, y: position.y },
          size: 10,
          fill: { color: new HSLA(60, 100, 50, 1) },
        });
        i++;
      });
  }
}
