import { characterSpeedPerPoint } from '../consts/consts';
import { gameMap } from '../core/GameMap/Configuration/GameMapConfiguration';
import { gameObjectManager } from '../core/global';
import {
  ExtendedDrawTextOptions,
  drawText,
} from '../core/utils/canvas/drawText';
import { Position } from '../core/types/Position';
import { RenderCharacterModel } from '../objects/character/character.model';

type Section = {
  width: number;
  draw?: (ctx: CanvasRenderingContext2D, centeredPosition: Position) => void;
};

export class UIRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById('interface')! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    window.addEventListener('resize', this.setCanvasSize.bind(this));
    this.setCanvasSize();
  }

  public render() {
    this.ctx.reset();

    this.renderCharacterDescription();
    this.renderLevelDescription();
  }

  private renderCharacterDescription() {
    const player = gameObjectManager.player;
    if (!player) return;

    const barHeight = 120;
    const text = {
      outlineColor: '#333',
      fontSize: { main: 26, secondary: 14, t: 14 },
    };

    const drawTextOptions: Omit<
      ExtendedDrawTextOptions,
      'position' | 'fontSize'
    > = {
      fillColor: '#fff',
      lineWidth: 1,
      strokeColor: '#444',
      isBold: false,
      textAlign: 'center',
      textBaseline: 'middle',
    };

    const sections: Section[] = [
      {
        width: barHeight + 40,
        draw: (ctx, centeredPosition) => {
          RenderCharacterModel.static(ctx, {
            position: centeredPosition,
            color: player.color,
            size: 65,
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
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          // Draw points
          if (player.level.upgradePoints > 0) {
            drawText(ctx, `Points: ${player.level.upgradePoints}`, {
              position: {
                x: centeredPosition.x - barHeight / 2 + 4,
                y: centeredPosition.y - barHeight / 2 + 20,
              },
              fontSize: 16,
              fillColor: 'white',
            });
          }

          drawText(
            ctx,
            (player.characteristics.speed / characterSpeedPerPoint).toFixed(1),
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
            player.level.upgrades.speed.current <
              player.level.upgrades.speed.max
          ) {
            drawUpgradeHelper(ctx, '1', centeredPosition);
          }
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(
            ctx,
            `${player.characteristics.energy.current.toFixed(0)}/${
              player.characteristics.energy.max
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
            drawUpgradeHelper(ctx, '2', centeredPosition);
          }
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(ctx, player.characteristics.energy.regen.toFixed(1), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: text.fontSize.main,
            ...drawTextOptions,
          });
          drawText(ctx, 'Regen', {
            position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
            fontSize: text.fontSize.secondary,
            ...drawTextOptions,
          });

          if (
            player.level.upgradePoints > 0 &&
            player.level.upgrades.regen.current <
              player.level.upgrades.regen.max
          ) {
            drawUpgradeHelper(ctx, '3', centeredPosition);
          }
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          if (!player.firstSkill) return;

          drawText(ctx, player.level.upgrades.firstSpell.current.toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: 26,
            ...drawTextOptions,
          });
          drawText(
            ctx,
            (player.firstSkill.cooldownPersentage * 100).toFixed(0),
            {
              position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
              fontSize: 12,
              ...drawTextOptions,
            }
          );
          drawSkillPoints(
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
            drawUpgradeHelper(ctx, '4', centeredPosition);
          } else if (player.level.upgrades.firstSpell.current > 0) {
            drawUseHelper(ctx, '[ J ]', centeredPosition);
          }
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          if (!player.secondSkill) return;

          drawText(ctx, player.level.upgrades.secondSpell.current.toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 7 },
            fontSize: 26,
            ...drawTextOptions,
          });
          drawText(
            ctx,
            (player.secondSkill.cooldownPersentage * 100).toFixed(0),
            {
              position: { x: centeredPosition.x, y: centeredPosition.y + 17 },
              fontSize: 12,
              ...drawTextOptions,
            }
          );
          drawSkillPoints(
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
            drawUpgradeHelper(ctx, '5', centeredPosition);
          } else if (player.level.upgrades.secondSpell.current > 0) {
            drawUseHelper(ctx, '[ K ]', centeredPosition);
          }
        },
      },
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

    const drawSkillPoints = (
      ctx: CanvasRenderingContext2D,
      centeredPosition: Position,
      count: number
    ) => {
      ctx.fillStyle = 'yellow';
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      let i = -2;
      Array(5)
        .fill(1)
        .forEach(() => {
          ctx.beginPath();
          ctx.arc(
            centeredPosition.x + 15 * i,
            centeredPosition.y,
            5,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          i++;
        });
      i = -2;
      Array(count)
        .fill(1)
        .forEach(() => {
          ctx.beginPath();
          ctx.arc(
            centeredPosition.x + 15 * i,
            centeredPosition.y,
            5,
            0,
            2 * Math.PI
          );
          ctx.fill();
          i++;
        });
    };

    const drawExpBar = (
      ctx: CanvasRenderingContext2D,
      position: Position,
      value: number,
      maxValue: number,
      color: string
    ) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '000d';
      ctx.fillStyle = color;
      ctx.fillRect(position.x, position.y, barWidth * (value / maxValue), 20);
      this.ctx.strokeRect(position.x + 1, position.y, barWidth - 2, 20);
    };

    const drawUpgradeHelper = (
      ctx: CanvasRenderingContext2D,
      hint: string,
      centeredPosition: Position
    ) => {
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.roundRect(
        centeredPosition.x - 10,
        centeredPosition.y + 32,
        20,
        20,
        2
      );
      ctx.fill();
      drawText(ctx, hint, {
        position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
        fontSize: text.fontSize.t,
        fillColor: 'black',
        strokeColor: 'transparent',
        isBold: true,
        textAlign: 'center',
        textBaseline: 'middle',
      });
    };

    const drawUseHelper = (
      ctx: CanvasRenderingContext2D,
      hint: string,
      centeredPosition: Position
    ) => {
      drawText(ctx, hint, {
        position: { x: centeredPosition.x, y: centeredPosition.y + 43 },
        fontSize: text.fontSize.t + 1,
        fillColor: '#eee',
        strokeColor: 'transparent',
        isBold: true,
        textAlign: 'center',
        textBaseline: 'middle',
      });
    };

    // bg color
    this.ctx.fillStyle = '#000d';
    this.ctx.fillRect(barPosition.x, barPosition.y, barWidth, barHeight);

    // Draw Exp bar
    drawExpBar(
      this.ctx,
      { x: barPosition.x, y: barPosition.y - 20 },
      player.level.atePointOrbs,
      player.level.levelUpReq(),
      player.color.toString()
    );

    // Draw Sections
    sections.forEach(drawSection);
  }

  private renderLevelDescription() {
    const currentTunnelDetails = gameMap.getCurrentTunnelDetails();
    drawText(
      this.ctx,
      `${currentTunnelDetails.tunnel.name}: ${currentTunnelDetails.tunnel.type} ${
        currentTunnelDetails.currentLevel + 1
      }`,
      {
        fillColor: '#fff',
        fontSize: 42,
        position: { x: this.ctx.canvas.width / 2, y: 40 },
        textAlign: 'center',
        textBaseline: 'middle',
        lineWidth: 2.5,
        strokeColor: '#666',
      }
    );
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
