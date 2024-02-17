import { renderer } from "../../core/global";
import { Position } from "../../core/types/Position";

const characterSlow = 0.5;

export class CharacterMovement {
  public position: Position;
  public defaultSpeed: number;
  public currentSpeed: number;
  public isBlocked: boolean;
  public size: number;

  private pressedKeys: ("KeyW" | "KeyA" | "KeyS" | "KeyD" | "ShiftLeft")[];

  constructor(startPosition: Position, size: number) {
    this.position = startPosition;
    this.defaultSpeed = 400;
    this.currentSpeed = this.defaultSpeed;
    this.pressedKeys = [];
    this.isBlocked = false;
    this.size = size;
  }

  public unblock(): void {
    this.isBlocked = false;
  }

  public block(): void {
    this.isBlocked = true;
  }

  public bind() {
    document.addEventListener("keydown", this.movementStart.bind(this), false);
    document.addEventListener("keyup", this.movementEnd.bind(this), false);
  }

  public unbind() {
    document.removeEventListener(
      "keydown",
      this.movementStart.bind(this),
      false
    );
    document.removeEventListener("keyup", this.movementEnd.bind(this), false);
  }

  private movementStart(e: KeyboardEvent) {
    if (e.code === "KeyW") {
      if (!this.pressedKeys.includes("KeyW")) this.pressedKeys.push("KeyW");
    } else if (e.code === "KeyA") {
      if (!this.pressedKeys.includes("KeyA")) this.pressedKeys.push("KeyA");
    } else if (e.code === "KeyS") {
      if (!this.pressedKeys.includes("KeyS")) this.pressedKeys.push("KeyS");
    } else if (e.code === "KeyD") {
      if (!this.pressedKeys.includes("KeyD")) this.pressedKeys.push("KeyD");
    } else if (e.code === "ShiftLeft") {
      if (!this.pressedKeys.includes("ShiftLeft"))
        this.pressedKeys.push("ShiftLeft");
    }
  }

  private movementEnd(e: KeyboardEvent) {
    if (e.code === "KeyW") {
      this.pressedKeys = this.pressedKeys.filter((a) => a !== "KeyW");
    } else if (e.code === "KeyA") {
      this.pressedKeys = this.pressedKeys.filter((a) => a !== "KeyA");
    } else if (e.code === "KeyS") {
      this.pressedKeys = this.pressedKeys.filter((a) => a !== "KeyS");
    } else if (e.code === "KeyD") {
      this.pressedKeys = this.pressedKeys.filter((a) => a !== "KeyD");
    } else if (e.code === "ShiftLeft") {
      this.pressedKeys = this.pressedKeys.filter((a) => a !== "ShiftLeft");
    }
  }

  public onUpdate(progress: number) {
    if (this.isBlocked) return;

    let isMovingY =
      this.pressedKeys.includes("KeyW") || this.pressedKeys.includes("KeyS");
    let isMovingX =
      this.pressedKeys.includes("KeyA") || this.pressedKeys.includes("KeyD");

    /* normalizing the speed of the character */
    let normalizedSpeed = this.currentSpeed;
    if (isMovingY && isMovingX) normalizedSpeed /= 1.333;

    if (this.pressedKeys.includes("ShiftLeft"))
      normalizedSpeed *= characterSlow;

    /* Fix При нажатии двух клавиш A и D, W и S. Performance optimization!!! */
    if (this.pressedKeys.includes("KeyW")) {
      this.position.y -= normalizedSpeed * progress;
    }
    if (this.pressedKeys.includes("KeyS")) {
      this.position.y += normalizedSpeed * progress;
    }

    if (this.pressedKeys.includes("KeyA")) {
      this.position.x -= normalizedSpeed * progress;
    }
    if (this.pressedKeys.includes("KeyD")) {
      this.position.x += normalizedSpeed * progress;
    }

    /* Ты куда? Не убегай за екран!!! */
    if (this.position.x < this.size / 2) this.position.x = this.size / 2;
    else if (this.position.x > renderer.canvasSize.x - this.size / 2)
      this.position.x = renderer.canvasSize.x - this.size / 2;
    if (this.position.y < this.size / 2) this.position.y = this.size / 2;
    else if (this.position.y > renderer.canvasSize.y - this.size / 2)
      this.position.y = renderer.canvasSize.y - this.size / 2;
  }
}
