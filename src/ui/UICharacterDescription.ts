import { UICONFIG } from '../configs/ui.config';
import { speedPerPoint } from '../consts/consts';
import { gameObjectManager } from '../core/global';
import { Position } from '../core/types/Position';
import { drawCircle } from '../core/utils/canvas/drawCircle';
import { drawText, DrawTextOptions } from '../core/utils/canvas/drawText';
import { HSLA } from '../core/utils/hsla';
import { Character } from '../objects/character/character';
import { Upgrade } from '../objects/character/character.levels';

type Section = {
  width: number;
  draw?: (ctx: CanvasRenderingContext2D, centeredPosition: Position) => void;
};

export class UICharacterDescription {
  private ctx: CanvasRenderingContext2D;

  private height: number = UICONFIG.characterDescription.height;
  private expBarHeight: number = UICONFIG.characterDescription.expBarHeight;
  private sectionConfig = UICONFIG.characterDescription.section;

  private drawTextOptions: Omit<DrawTextOptions, 'position' | 'fontSize'> = {
    fill: { color: new HSLA(0, 0, 100, 1) },
    stroke: { width: 0.5, color: new HSLA(0, 0, 27, 1) },
    isBold: false,
    textAlign: 'center',
    textBaseline: 'middle',
  };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public renderCharacterDescription() {
    const player = gameObjectManager.player;
    if (!player) return;

    const defaultSectionWidth = 120;

    const characterLevelSection: Section = {
      width: defaultSectionWidth + 40,
      draw: (ctx, centeredPosition) => {
        drawCircle(ctx, {
          position: centeredPosition,
          size: 65,
          fill: { color: player.UIColor },
        });
        drawText(ctx, player.level.currentLevel.toString(), {
          position: { x: centeredPosition.x, y: centeredPosition.y + 3 },
          fontSize: 36,
          ...this.drawTextOptions,
        });

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333';
        ctx.moveTo(
          centeredPosition.x + characterLevelSection.width / 2,
          centeredPosition.y - this.height / 2
        );
        ctx.lineTo(
          centeredPosition.x + characterLevelSection.width / 2,
          centeredPosition.y + this.height / 2
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
              x: centeredPosition.x - speedSection.width / 2 + 10,
              y: centeredPosition.y - this.height / 2 + 20,
            },
            fontSize: this.sectionConfig.useSkillHint.fontSize,
            fill: { color: new HSLA(0, 0, 100, 1) },
            textAlign: 'start',
          });
        }

        this.drawCharacteristicSection(ctx, {
          player,
          value: (player.characteristics.getSpeed / speedPerPoint).toFixed(1),
          centeredPosition,
          description: 'Speed',
          upgradeHint: '1',
          isMaxLvl: !(
            player.level.upgrades.speed.current <
            player.level.upgrades.speed.max
          ),
        });
      },
    };

    const energySection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        this.drawCharacteristicSection(ctx, {
          player,
          value: `${player.characteristics.getEnergy.current.toFixed(0)}/${
            player.characteristics.getEnergy.max
          }`,
          centeredPosition,
          description: 'Energy',
          upgradeHint: '2',
          isMaxLvl: !(
            player.level.upgrades.maxEnergy.current <
            player.level.upgrades.maxEnergy.max
          ),
        });
      },
    };

    const regenerationSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        this.drawCharacteristicSection(ctx, {
          player,
          value: player.characteristics.getEnergy.regeneration.toFixed(1),
          centeredPosition,
          description: 'Regen',
          upgradeHint: '3',
          isMaxLvl: !(
            player.level.upgrades.energyRegeneration.current <
            player.level.upgrades.energyRegeneration.max
          ),
        });
      },
    };

    const firstSkillSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        this.drawSkillSection(ctx, {
          player,
          centeredPosition,
          useHint: '[ J ]',
          upgradeHint: '4',
          skillUpgrades: player.level.upgrades.firstSpell,
          cooldownPercentage: player.firstSkill.cooldownPercentage,
        });
      },
    };

    const secondSkillSection: Section = {
      width: defaultSectionWidth,
      draw: (ctx, centeredPosition) => {
        this.drawSkillSection(ctx, {
          player,
          centeredPosition,
          useHint: '[ K ]',
          upgradeHint: '5',
          skillUpgrades: player.level.upgrades.secondSpell,
          cooldownPercentage: player.secondSkill.cooldownPercentage,
        });
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
      y: this.ctx.canvas.height - this.height,
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
          y: position.y + this.height / 2,
        };
        section.draw(this.ctx, centeredPosition);
      }
    };

    // bg color
    this.ctx.fillStyle = '#000d';
    this.ctx.fillRect(barPosition.x, barPosition.y, barWidth, this.height);

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

  private drawExpBar(
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

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000d';
    ctx.fillStyle = player.UIColor.toString();
    ctx.fillRect(
      position.x,
      position.y - this.expBarHeight,
      barWidth * (value / maxValue),
      this.expBarHeight
    );
    ctx.strokeRect(
      position.x + 1,
      position.y - this.expBarHeight,
      barWidth - 2,
      this.expBarHeight
    );
  }

  private drawSkillSection(
    ctx: CanvasRenderingContext2D,
    params: {
      player: Character;
      centeredPosition: Position;
      upgradeHint: string;
      useHint: string;
      skillUpgrades: Upgrade;
      cooldownPercentage: number;
    }
  ): void {
    const {
      player,
      centeredPosition,
      upgradeHint,
      useHint,
      skillUpgrades,
      cooldownPercentage,
    } = params;

    drawText(ctx, skillUpgrades.current.toString(), {
      position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
      fontSize: this.sectionConfig.mainValue.fontSize,
      ...this.drawTextOptions,
    });
    drawText(ctx, (cooldownPercentage * 100).toFixed(0), {
      position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
      fontSize: this.sectionConfig.description.fontSize,
      ...this.drawTextOptions,
    });
    this.drawSkillPoints(
      ctx,
      {
        x: centeredPosition.x,
        y: centeredPosition.y - this.height / 2 + 20,
      },
      skillUpgrades.current
    );

    if (
      player.level.upgradePoints > 0 &&
      skillUpgrades.current < skillUpgrades.max
    ) {
      this.drawUpgradeHelper(ctx, {
        hint: upgradeHint,
        position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
        fontSize: this.sectionConfig.upgradeHint.fontSize,
      });
    } else if (skillUpgrades.current > 0) {
      this.drawUseHelper(ctx, {
        hint: useHint,
        position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
        fontSize: this.sectionConfig.useSkillHint.fontSize,
      });
    }
  }

  private drawCharacteristicSection(
    ctx: CanvasRenderingContext2D,
    params: {
      player: Character;
      centeredPosition: Position;
      description: string;
      upgradeHint: string;
      value: string;
      isMaxLvl: boolean;
    }
  ): void {
    const {
      player,
      centeredPosition,
      description,
      upgradeHint,
      value,
      isMaxLvl,
    } = params;

    drawText(ctx, value, {
      position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
      fontSize: this.sectionConfig.mainValue.fontSize,
      ...this.drawTextOptions,
    });
    drawText(ctx, description, {
      position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
      fontSize: this.sectionConfig.description.fontSize,
      ...this.drawTextOptions,
    });

    if (player.level.upgradePoints > 0 && isMaxLvl === false) {
      this.drawUpgradeHelper(ctx, {
        hint: upgradeHint,
        position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
        fontSize: this.sectionConfig.upgradeHint.fontSize,
      });
    }
  }

  private drawUpgradeHelper(
    ctx: CanvasRenderingContext2D,
    params: { hint: string; position: Position; fontSize: number }
  ): void {
    const { position, fontSize, hint } = params;
    const rectangleSize = 20;

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.roundRect(
      position.x - rectangleSize / 2,
      position.y - rectangleSize / 2 - 2,
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

  private drawUseHelper(
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

  private drawSkillPoints(
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
