import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderEnemyModel } from "./enemy.model";

export class Enemy extends GameObject<"circle"> {
  private velocity: { x: number; y: number };

  constructor(
    position: Position,
    size: number,
    velocity: { x: number; y: number }
  ) {
    super(position, { shape: "circle", size });
    this.velocity = velocity;
  }

  public override create(): void {
    gameObjectManager.addEnemy(this);
  }

  public override delete(): void {
    gameObjectManager.removeEnemy(this.id);
  }

  public override onUpdate(deltaTime: number): void {
    if (this.objectModel.shape !== "circle") throw new Error("not implemented");

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Check for collisions with walls
    if (
      this.position.x - this.objectModel.size / 2 < 0 ||
      this.position.x + this.objectModel.size / 2 > window.innerWidth
    ) {
      this.velocity.x = -this.velocity.x; // Reverse the x-direction velocity
    }

    if (
      this.position.y - this.objectModel.size / 2 < 0 ||
      this.position.y + this.objectModel.size / 2 > window.innerHeight
    ) {
      this.velocity.y = -this.velocity.y; // Reverse the y-direction velocity
    }

    // Check for collisions with save zones
    gameObjectManager.saveZones.forEach((saveZone) => {
      const saveZoneLeft =
        saveZone.position.x - saveZone.objectModel.size.x / 2;
      const saveZoneRight =
        saveZone.position.x + saveZone.objectModel.size.x / 2;
      const saveZoneTop = saveZone.position.y - saveZone.objectModel.size.y / 2;
      const saveZoneBottom =
        saveZone.position.y + saveZone.objectModel.size.y / 2;

      if (
        this.position.x - this.objectModel.size / 2 < saveZoneRight &&
        this.position.x + this.objectModel.size / 2 > saveZoneLeft &&
        this.position.y - this.objectModel.size / 2 < saveZoneBottom &&
        this.position.y + this.objectModel.size / 2 > saveZoneTop
      ) {
        // Calculate the overlap on each side
        const overlapLeft =
          saveZoneRight - this.position.x + this.objectModel.size / 2;
        const overlapRight =
          this.position.x + this.objectModel.size / 2 - saveZoneLeft;
        const overlapTop =
          saveZoneBottom - this.position.y + this.objectModel.size / 2;
        const overlapBottom =
          this.position.y + this.objectModel.size / 2 - saveZoneTop;

        // Find the minimum overlap
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        // Adjust the position based on the minimum overlap
        if (minOverlap === overlapLeft) {
          this.velocity.x = -this.velocity.x; // Reverse the x-direction velocity
        } else if (minOverlap === overlapRight) {
          this.velocity.x = -this.velocity.x; // Reverse the x-direction velocity
        } else if (minOverlap === overlapTop) {
          this.velocity.y = -this.velocity.y; // Reverse the y-direction velocity
        } else if (minOverlap === overlapBottom) {
          this.velocity.y = -this.velocity.y; // Reverse the y-direction velocity
        }
      }
    });

    /* Ты куда? Не убегай за екран!!! */
    if (this.position.x < this.objectModel.size / 2)
      this.position.x = this.objectModel.size / 2;
    else if (this.position.x > window.innerWidth - this.objectModel.size / 2)
      this.position.x = window.innerWidth - this.objectModel.size / 2;
    if (this.position.y < this.objectModel.size / 2)
      this.position.y = this.objectModel.size / 2;
    else if (this.position.y > window.innerHeight - this.objectModel.size / 2)
      this.position.y = window.innerHeight - this.objectModel.size / 2;
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.objectModel.shape !== "circle") throw new Error("not implemented");

    RenderEnemyModel(ctx, this.position, this.objectModel.size);
  }
}
