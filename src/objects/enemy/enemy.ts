import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager, renderer } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderEnemyModel } from "./enemy.model";
import { SaveZone } from "../saveZone/SaveZone";

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
    const { newPosition, newVelocity } = this.boundaryCollision();
    this.position = newPosition;
    this.velocity = newVelocity;

    // Check for collisions with save zones
    gameObjectManager.saveZones.forEach(this.collisionWithSaveZone.bind(this));
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.objectModel.shape !== "circle") throw new Error("not implemented");

    RenderEnemyModel(ctx, this.position, this.objectModel.size);
  }

  private collisionWithSaveZone(saveZone: SaveZone) {
    const saveZoneLeft = saveZone.position.x - saveZone.objectModel.size.x / 2;
    const saveZoneRight = saveZone.position.x + saveZone.objectModel.size.x / 2;
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
      const overlaps = {
        left: saveZoneRight - this.position.x + this.objectModel.size / 2,
        right: this.position.x + this.objectModel.size / 2 - saveZoneLeft,
        top: saveZoneBottom - this.position.y + this.objectModel.size / 2,
        bottom: this.position.y + this.objectModel.size / 2 - saveZoneTop,
      };

      // Find the minimum overlap
      const minOverlap = Math.min(
        overlaps.left,
        overlaps.right,
        overlaps.top,
        overlaps.bottom
      );

      // Adjust the position and velocity based on the minimum overlap
      if (minOverlap === overlaps.left) {
        this.position.x = saveZoneRight + this.objectModel.size / 2;
        this.velocity.x = -this.velocity.x;
      } else if (minOverlap === overlaps.right) {
        this.position.x = saveZoneLeft - this.objectModel.size / 2;
        this.velocity.x = -this.velocity.x;
      } else if (minOverlap === overlaps.top) {
        this.position.y = saveZoneBottom + this.objectModel.size / 2;
        this.velocity.y = -this.velocity.y;
      } else if (minOverlap === overlaps.bottom) {
        this.position.y = saveZoneTop - this.objectModel.size / 2;
        this.velocity.y = -this.velocity.y;
      }
    }
  }

  private boundaryCollision() {
    const handleAxisCollision = (axis: "x" | "y") => {
      let newPosition: number;
      let newVelocity: number;

      const axisPosition = this.position[axis];
      const halfSize = this.objectModel.size / 2;
      const minAxisPosition = halfSize;
      const maxAxisPosition = renderer.canvasSize[axis] - halfSize;

      if (axisPosition - halfSize < 0) {
        newPosition = minAxisPosition;
        newVelocity = -this.velocity[axis];
      } else if (axisPosition > maxAxisPosition) {
        newPosition = maxAxisPosition;
        newVelocity = -this.velocity[axis];
      } else {
        newPosition = this.position[axis];
        newVelocity = this.velocity[axis];
      }

      return { newPosition, newVelocity };
    };
    const x = handleAxisCollision("x");
    const y = handleAxisCollision("y");

    return {
      newPosition: { x: x.newPosition, y: y.newPosition },
      newVelocity: { x: x.newVelocity, y: y.newVelocity },
    };
  }
}
