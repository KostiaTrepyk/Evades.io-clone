import { Position } from "../core/types/Position";

const characterSlow = 0.5;

export class CharacterMovement {
  position: Position;
  speed: number;

  private pressedKeys: ("KeyW" | "KeyA" | "KeyS" | "KeyD" | "ShiftLeft")[];

  constructor(startPosition: Position) {
    this.position = startPosition;
    this.speed = 600;
    this.pressedKeys = [];
  }

  bind() {
    document.addEventListener("keydown", this.movementStart.bind(this), false);
    document.addEventListener("keyup", this.movementEnd.bind(this), false);
  }

  unbind() {
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

  onUpdate(progress: number) {
    let isMovingY =
      this.pressedKeys.includes("KeyW") || this.pressedKeys.includes("KeyS");
    let isMovingX =
      this.pressedKeys.includes("KeyA") || this.pressedKeys.includes("KeyD");
    let speed = this.speed;

    /* normalizing the speed of the character */
    if (isMovingY && isMovingX) speed /= 1.333;

    if (this.pressedKeys.includes("ShiftLeft")) speed *= characterSlow;

    /* if (
      this.pressedKeys.includes("KeyW") &&
      this.pressedKeys.includes("KeyS")
    ) {
    } else  */

    /* Fix При нажатии двух клавиш A и D, W и S */
    if (this.pressedKeys.includes("KeyW")) {
      this.position.y -= speed * progress;
    } else if (this.pressedKeys.includes("KeyS")) {
      this.position.y += speed * progress;
    }

    if (this.pressedKeys.includes("KeyA")) {
      this.position.x -= speed * progress;
    } else if (this.pressedKeys.includes("KeyD")) {
      this.position.x += speed * progress;
    }
  }
}
