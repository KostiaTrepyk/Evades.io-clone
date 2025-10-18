import { userInput } from '../../core/global';
import { GAMECONFIG } from '../../configs/game.config';
import { Character } from './character';
import { Module } from '../../core/common/Module';

export class CharacterMovement implements Module {
  private readonly player: Character;
  private isBlocked: boolean;

  constructor(player: Character) {
    this.player = player;
    this.isBlocked = false;
  }

  public onUpdate(deltaTime: number): void {
    if (this.isBlocked) return;

    const isPressedW: boolean = userInput.isKeypress('KeyW');
    const isPressedS: boolean = userInput.isKeypress('KeyS');
    const isPressedA: boolean = userInput.isKeypress('KeyA');
    const isPressedD: boolean = userInput.isKeypress('KeyD');
    const isPressedShift: boolean = userInput.isKeypress('ShiftLeft');

    const isBothWSPressed: boolean = isPressedW && isPressedS;
    const isBothADPressed: boolean = isPressedA && isPressedD;

    const isMovingY: boolean = (isPressedW || isPressedS) && !isBothWSPressed;
    const isMovingX: boolean = (isPressedA || isPressedD) && !isBothADPressed;

    if (!isMovingX && !isMovingY) return;

    // normalizing the speed of the character
    let normalizedSpeed: number = this.player.characteristics.getSpeed;
    if (isMovingX && isMovingY) normalizedSpeed /= 1.333;

    if (isPressedShift) normalizedSpeed *= GAMECONFIG.characterSlowRatio;

    if (isPressedW && isMovingY) {
      this.player.prevPosition.y = this.player.position.y;
      this.player.position.y -= normalizedSpeed * deltaTime;
    }

    if (isPressedS && isMovingY) {
      this.player.prevPosition.y = this.player.position.y;
      this.player.position.y += normalizedSpeed * deltaTime;
    }

    if (isPressedA && isMovingX) {
      this.player.prevPosition.x = this.player.position.x;
      this.player.position.x -= normalizedSpeed * deltaTime;
    }

    if (isPressedD && isMovingX) {
      this.player.prevPosition.x = this.player.position.x;
      this.player.position.x += normalizedSpeed * deltaTime;
    }
  }

  public unblock(): void {
    this.isBlocked = false;
  }

  public block(): void {
    this.isBlocked = true;
  }

  public get getIsBlocked(): boolean {
    return this.isBlocked;
  }
}
