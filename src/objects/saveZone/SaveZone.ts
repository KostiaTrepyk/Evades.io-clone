import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";

export class SaveZone extends GameObject<"rectangular"> {
  constructor(position: Position, size: { x: number; y: number }) {
    super(position, { shape: "rectangular", size });
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

  /** You can use this method to check collision between `SaveZone` and `GameObject<"circle">` */
  public isInside(gameObject: GameObject<"circle">) {
    const enemyHalfSize = gameObject.objectModel.size / 2;
    const saveZoneHalfSize = {
      x: this.objectModel.size.x / 2,
      y: this.objectModel.size.y / 2,
    };

    const saveZoneLeft = this.position.x - saveZoneHalfSize.x;
    const saveZoneRight = this.position.x + saveZoneHalfSize.x;
    const saveZoneTop = this.position.y - saveZoneHalfSize.y;
    const saveZoneBottom = this.position.y + saveZoneHalfSize.y;

    return (
      gameObject.position.x - enemyHalfSize < saveZoneRight &&
      gameObject.position.x + enemyHalfSize > saveZoneLeft &&
      gameObject.position.y - enemyHalfSize < saveZoneBottom &&
      gameObject.position.y + enemyHalfSize > saveZoneTop
    );
  }
}
