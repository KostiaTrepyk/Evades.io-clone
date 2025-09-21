import { Position } from '../../core/types/Position';
import { userInput } from '../../core/global';
import { gameConfig } from '../../configs/game.config';
import { Character } from './character';

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

    const isBothWSPressed =
      userInput.isKeypress('KeyW') && userInput.isKeypress('KeyS');
    const isBothADPressed =
      userInput.isKeypress('KeyA') && userInput.isKeypress('KeyD');

    let isMovingY =
      (userInput.isKeypress('KeyW') || userInput.isKeypress('KeyS')) &&
      !isBothWSPressed;
    let isMovingX =
      (userInput.isKeypress('KeyA') || userInput.isKeypress('KeyD')) &&
      !isBothADPressed;

    if (!isMovingY && !isMovingX) return;

    // normalizing the speed of the character
    let normalizedSpeed = this.player.characteristics.speed;
    if (isMovingY && isMovingX) normalizedSpeed /= 1.333;

    if (userInput.isKeypress('ShiftLeft'))
      normalizedSpeed *= gameConfig.characterSlowRatio;

    if (userInput.isKeypress('KeyW') && isMovingY) {
      this.position.y -= normalizedSpeed * progress;
    }

    if (userInput.isKeypress('KeyS') && isMovingY) {
      this.position.y += normalizedSpeed * progress;
    }

    if (userInput.isKeypress('KeyA') && isMovingX) {
      this.position.x -= normalizedSpeed * progress;
    }

    if (userInput.isKeypress('KeyD') && isMovingX) {
      this.position.x += normalizedSpeed * progress;
    }
  }
}
