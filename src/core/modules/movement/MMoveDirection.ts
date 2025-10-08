import { userInput } from '../../global';
import { MoveDirection } from '../../types/moveDirection';

/**
 * Handles calculation and normalization of movement direction based on user input.
 *
 * The `MMoveDirection` class tracks the current movement direction as a 2D vector,
 * updating it according to WASD keypresses. It normalizes diagonal movement to ensure
 * consistent speed in all directions and reverses the y-direction to match the coordinate system.
 *
 * @remarks
 * - Uses `userInput.isKeypress` to detect key states.
 * - The movement direction is exposed via the `moveDirection` getter.
 *
 * @example
 * ```typescript
 * const moveDir = new MMoveDirection();
 * moveDir.onUpdate();
 * const direction = moveDir.moveDirection; // { x: number, y: number }
 * ```
 */
export class MMoveDirection {
  private _moveDirection: MoveDirection;

  constructor() {
    this._moveDirection = { x: 0, y: 0 };
  }

  public onUpdate(): void {
    this.calculateMovementDirection();
  }

  private calculateMovementDirection() {
    const isPressedW = userInput.isKeypress('KeyW');
    const isPressedS = userInput.isKeypress('KeyS');
    const isPressedA = userInput.isKeypress('KeyA');
    const isPressedD = userInput.isKeypress('KeyD');

    if (!isPressedW && !isPressedS && !isPressedA && !isPressedD) return;

    // Only update moveDirection if a movement key is pressed
    this._moveDirection.x = 0;
    this._moveDirection.y = 0;

    if (isPressedW) this._moveDirection.y = 1;
    else if (isPressedS) this._moveDirection.y = -1;

    if (isPressedA) this._moveDirection.x = -1;
    else if (isPressedD) this._moveDirection.x = 1;

    // Normalize diagonal movement
    if (this._moveDirection.x !== 0 && this._moveDirection.y !== 0) {
      const diagonalFactor = 1 / Math.sqrt(2);
      this._moveDirection.x *= diagonalFactor;
      this._moveDirection.y *= diagonalFactor;
    }

    // Reverse y-direction
    this._moveDirection.y *= -1;
  }

  public get moveDirection(): MoveDirection {
    return this._moveDirection;
  }
}
