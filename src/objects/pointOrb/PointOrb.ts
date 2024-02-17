import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderPointOrb } from "./PoinOrb.model";

const pointOrbSize: number = 30;
const pointOrbColors = ["pink", "lightgreen", "#fa7", "lightblue"] as const;

export class PointOrb extends GameObject<"circle"> {
  private color: string;
  constructor(startPosition: Position) {
    super(startPosition, { shape: "circle", size: pointOrbSize });
    this.color = pointOrbColors[Math.round(Math.random() * pointOrbColors.length)];
  }

  public override create(): void {
    gameObjectManager.addPointOrb(this);
  }

  public override delete(): void {
    gameObjectManager.removePointOrb(this.id);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderPointOrb(ctx, this.position, this.objectModel.size, this.color);
  }
}
