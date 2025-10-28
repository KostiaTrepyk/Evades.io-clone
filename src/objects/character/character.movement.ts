import { time, userInput } from '../../core/global';
import { GAMECONFIG } from '../../configs/game.config';
import { Character } from './character';
import { Module } from '../../core/common/Module';

export class CharacterMovement implements Module {
  private readonly _player: Character;
  private _isBlocked: boolean;

  constructor(player: Character) {
    this._player = player;
    this._isBlocked = false;
  }

  public onUpdate(): void {
    if (this._isBlocked) return;

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
    let normalizedSpeed: number = this._player.characteristics.speed;
    if (isMovingX && isMovingY) normalizedSpeed /= 1.333;

    if (isPressedShift) normalizedSpeed *= GAMECONFIG.characterSlowRatio;

    if (isPressedW && isMovingY) {
      this._player.prevPosition.y = this._player.position.y;
      this._player.position.y -= normalizedSpeed * time.deltaTime;
    }

    if (isPressedS && isMovingY) {
      this._player.prevPosition.y = this._player.position.y;
      this._player.position.y += normalizedSpeed * time.deltaTime;
    }

    if (isPressedA && isMovingX) {
      this._player.prevPosition.x = this._player.position.x;
      this._player.position.x -= normalizedSpeed * time.deltaTime;
    }

    if (isPressedD && isMovingX) {
      this._player.prevPosition.x = this._player.position.x;
      this._player.position.x += normalizedSpeed * time.deltaTime;
    }
  }

  public unblock(): void {
    this._isBlocked = false;
  }

  public block(): void {
    this._isBlocked = true;
  }

  public get isBlocked(): boolean {
    return this._isBlocked;
  }
}
