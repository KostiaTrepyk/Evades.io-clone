import { userInput } from '@core/global';
import type { MoveDirection } from '@shared-types/moveDirection';
import type { Module } from 'modules/Module';

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
 * moveDir.beforeUpdate();
 * const direction = moveDir.moveDirection; // { x: number, y: number }
 * ```
 */
export class MMoveDirection implements Module {
  private readonly _moveDirection: MoveDirection;

  constructor() {
    // Должно быть x:1 что-бы избежать багов таких как тп на то же самое место или снаряды которые стоят на месте так как направления нету (оно по нелям).
    this._moveDirection = { x: 1, y: 0 };
  }

  /** Should be applied before player movement. */
  public beforeUpdate(): void {
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
      this._moveDirection.x = this._moveDirection.x * diagonalFactor;
      this._moveDirection.y = this._moveDirection.y * diagonalFactor;
    }

    // Reverse y-direction
    this._moveDirection.y *= -1;
  }

  public get moveDirection(): MoveDirection {
    return this._moveDirection;
  }
}
