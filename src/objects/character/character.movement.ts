import { userInput } from '../../core/global';
import { gameConfig } from '../../configs/game.config';
import { Character } from './character';

export class CharacterMovement {
  public player: Character;
  public isBlocked: boolean;

  constructor(player: Character) {
    this.player = player;
    this.isBlocked = false;
  }

  public unblock(): void {
    this.isBlocked = false;
  }

  public block(): void {
    this.isBlocked = true;
  }

  public onUpdate(deltaTime: number) {
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
      this.player.prevPosition.y = this.player.position.y;
      this.player.position.y -= normalizedSpeed * deltaTime;
    }

    if (userInput.isKeypress('KeyS') && isMovingY) {
      this.player.prevPosition.y = this.player.position.y;
      this.player.position.y += normalizedSpeed * deltaTime;
    }

    if (userInput.isKeypress('KeyA') && isMovingX) {
      this.player.prevPosition.x = this.player.position.x;
      this.player.position.x -= normalizedSpeed * deltaTime;
    }

    if (userInput.isKeypress('KeyD') && isMovingX) {
      this.player.prevPosition.x = this.player.position.x;
      this.player.position.x += normalizedSpeed * deltaTime;
    }
  }
}
