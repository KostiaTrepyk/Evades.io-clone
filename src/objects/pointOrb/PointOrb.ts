import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";
import { Shape } from "../../core/types/Shape";
import { RenderPointOrb } from "./PoinOrb.model";

const pointOrbSize: number = 15;

export class PointOrb extends GameObject<"circle"> {
  constructor(startPosition: Position) {
    super(startPosition, { shape: "circle", size: pointOrbSize });
  }

  public override create(): void {
    gameObjectManager.addPointOrb(this);
  }

  public override delete(): void {
    gameObjectManager.removePointOrb(this.id);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderPointOrb(ctx, this.position, this.objectModel.size);
  }
}
