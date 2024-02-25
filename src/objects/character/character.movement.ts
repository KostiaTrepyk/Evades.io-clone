import { userInput } from '../../core/global';
import { Position } from '../../core/types/Position';
import { Character } from './character';

const characterSlow = 0.5;

export class CharacterMovement {
  public player: Character;
  public position: Position;
  public isBlocked: boolean;
  public size: number;

  constructor(player: Character, startPosition: Position, size: number) {
    this.player = player;
    this.position = startPosition;
    this.isBlocked = false;
    this.size = size;
  }

  public unblock(): void {
    this.isBlocked = false;
  }

  public block(): void {
    this.isBlocked = true;
  }

  public onUpdate(progress: number) {
    if (this.isBlocked) return;

    let isMovingY = userInput.isKeypress('KeyW') || userInput.isKeypress('KeyS');
    let isMovingX = userInput.isKeypress('KeyA') || userInput.isKeypress('KeyD');

    // normalizing the speed of the character
    let normalizedSpeed = this.player.characteristics.speed;
    if (isMovingY && isMovingX) normalizedSpeed /= 1.333;

    if (userInput.isKeypress('ShiftLeft')) normalizedSpeed *= characterSlow;

    // Fix При нажатии двух клавиш A и D, W и S. Performance optimization!!!
    if (userInput.isKeypress('KeyW')) {
      this.position.y -= normalizedSpeed * progress;
    }
    if (userInput.isKeypress('KeyS')) {
      this.position.y += normalizedSpeed * progress;
    }

    if (userInput.isKeypress('KeyA')) {
      this.position.x -= normalizedSpeed * progress;
    }
    if (userInput.isKeypress('KeyD')) {
      this.position.x += normalizedSpeed * progress;
    }
  }
}
