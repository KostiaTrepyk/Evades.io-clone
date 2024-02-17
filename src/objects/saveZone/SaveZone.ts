import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";

export class SaveZone extends GameObject<"rectangle"> {
  constructor(position: Position, size: { x: number; y: number }) {
    super(position, { shape: "rectangle", size });
  }

  public override create(): void {
    gameObjectManager.saveZones.push(this);
  }

  public override delete(): void {
    gameObjectManager.saveZones = gameObjectManager.saveZones.filter(
      (saveZone) => saveZone !== this
    );
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "hsla(100, 100%, 50%, 0.3)";
    ctx.fillRect(
      this.position.x - this.objectModel.size.x / 2,
      this.position.y - this.objectModel.size.y / 2,
      this.objectModel.size.x,
      this.objectModel.size.y
    );
  }
}
