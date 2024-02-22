import { GameObject } from "../../core/common/GameObject";
import { doItemsIntersect } from "../../core/doItemsIntersect";
import { gameObjectManager, levelManager } from "../../core/global";
import { Position } from "../../core/types/Position";

export class Portal extends GameObject<"rectangle"> {
  private portalTo: "nextLevel" | "prevLevel";

  constructor(
    startPosition: Position,
    size: { x: number; y: number },
    portalTo: "nextLevel" | "prevLevel"
  ) {
    super(startPosition, { shape: "rectangle", size });
    this.portalTo = portalTo;
  }

  public override create(): void {
    gameObjectManager.addGameObject(this)
  }

  public override delete(): void {
    gameObjectManager.removeGameObject(this)
  }

  public nextLevel() {
    levelManager.nextLevel();
  }

  public prevLevel() {
    levelManager.prevLevel();
  }

  public override onUpdate(deltaTime: number): void {
    if (
      gameObjectManager.player &&
      doItemsIntersect(this, gameObjectManager.player)
    ) {
      switch (this.portalTo) {
        case "nextLevel":
          this.nextLevel();
          break;
        case "prevLevel":
          this.prevLevel();
          break;
        default:
          throw new Error("PortalTo error");
      }
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "hsla(180, 100%, 50%, 0.3)";
    ctx.fillRect(
      this.position.x - this.objectModel.size.x / 2,
      this.position.y - this.objectModel.size.y / 2,
      this.objectModel.size.x,
      this.objectModel.size.y
    );
  }
}
