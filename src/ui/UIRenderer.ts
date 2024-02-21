import { gameObjectManager, levelManager } from "../core/global";
import {
  ExtendedDrawTextOptions,
  drawText,
} from "../core/helpers/canvas/drawText";
import { Position } from "../core/types/Position";
import { RenderMagmaxModel } from "../objects/characters/magmax/magmax.model";

type Section = {
  width: number;
  draw?: (ctx: CanvasRenderingContext2D, centeredPosition: Position) => void;
};

export class UIRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById("interface")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;

    window.addEventListener("resize", this.setCanvasSize.bind(this));
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
      outlineColor: "#333",
      fontSize: { main: 29, secondary: 16 },
    };

    const drawTextOptions: Omit<
      ExtendedDrawTextOptions,
      "position" | "fontSize"
    > = {
      fillColor: "#fff",
      lineWidth: 1,
      strokeColor: "#444",
      isBold: false,
      textAlign: "center",
      textBaseline: "middle",
    };

    const sections: Section[] = [
      {
        width: barHeight + 20,
        draw: (ctx, centeredPosition) => {
          RenderMagmaxModel.default(ctx, centeredPosition, 65, {
            isFirstSpellActive: false,
            isSecondSpellActive: false,
          });
          drawText(ctx, player.level.currentLevel.toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y + 3 },
            fontSize: 36,
            ...drawTextOptions,
          });
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(
            ctx,
            (player.characterMovement.defaultSpeed / 80).toFixed(1).toString(),
            {
              position: { x: centeredPosition.x, y: centeredPosition.y - 2 },
              fontSize: text.fontSize.main,
              ...drawTextOptions,
            }
          );
          drawText(ctx, "Speed", {
            position: { x: centeredPosition.x, y: centeredPosition.y + 22 },
            fontSize: text.fontSize.secondary,
            ...drawTextOptions,
          });
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(
            ctx,
            `${player.energy.current.toFixed(0)}/${player.energy.max}`,
            {
              position: { x: centeredPosition.x, y: centeredPosition.y - 2 },
              fontSize: text.fontSize.main,
              ...drawTextOptions,
            }
          );
          drawText(ctx, "Energy", {
            position: { x: centeredPosition.x, y: centeredPosition.y + 22 },
            fontSize: text.fontSize.secondary,
            ...drawTextOptions,
          });
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(ctx, player.energy.regen.toFixed(1).toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 2 },
            fontSize: text.fontSize.main,
            ...drawTextOptions,
          });
          drawText(ctx, "Regen", {
            position: { x: centeredPosition.x, y: centeredPosition.y + 22 },
            fontSize: text.fontSize.secondary,
            ...drawTextOptions,
          });
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(ctx, player.level.upgrades.firstSpell.toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 2 },
            fontSize: 26,
            ...drawTextOptions,
          });
          drawText(ctx, "First spell", {
            position: { x: centeredPosition.x, y: centeredPosition.y + 22 },
            fontSize: 12,
            ...drawTextOptions,
          });
          drawSkillPoints(
            ctx,
            {
              x: centeredPosition.x,
              y: centeredPosition.y - barHeight / 2 + 20,
            },
            player.level.upgrades.firstSpell
          );
        },
      },
      {
        width: barHeight,
        draw: (ctx, centeredPosition) => {
          drawText(ctx, player.level.upgrades.secondSpell.toString(), {
            position: { x: centeredPosition.x, y: centeredPosition.y - 2 },
            fontSize: 26,
            ...drawTextOptions,
          });
          drawText(ctx, "Second spell", {
            position: { x: centeredPosition.x, y: centeredPosition.y + 22 },
            fontSize: 12,
            ...drawTextOptions,
          });
          drawSkillPoints(
            ctx,
            {
              x: centeredPosition.x,
              y: centeredPosition.y - barHeight / 2 + 20,
            },
            player.level.upgrades.secondSpell
          );
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
        else throw new Error("Section does not exist");
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
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "#666";
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
      ctx.strokeStyle = "000d";
      ctx.fillStyle = color;
      ctx.fillRect(position.x, position.y, barWidth * (value / maxValue), 20);
      this.ctx.strokeRect(position.x + 1, position.y, barWidth - 2, 20);
    };

    // bg color
    this.ctx.fillStyle = "#000d";
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
    drawText(
      this.ctx,
      `Central Core: Area ${levelManager.currentLevel} (${levelManager.currentStage})`,
      {
        fillColor: "#fff",
        fontSize: 42,
        position: { x: this.ctx.canvas.width / 2, y: 40 },
        textAlign: "center",
        textBaseline: "middle",
        lineWidth: 2.5,
        strokeColor: "#666",
      }
    );
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
