import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';
import { ISkill } from './ISkill';

export interface CommonSkillOptions {
  /** Клавиша на которую забинджено */
  keyCode: KeyCode;
  energyUsage: () => number;
  cooldown: () => number;
  onUse: () => void;
  condition: () => boolean;
}

export class CommonSkill implements ISkill {
  private _player: Character;

  private readonly _keyCode: KeyCode;
  private _cooldown: CommonSkillOptions['cooldown'];
  private _energyUsage: CommonSkillOptions['energyUsage'];
  private _onUse: CommonSkillOptions['onUse'];
  private _condition: CommonSkillOptions['condition'];
  private _lastUsedTimestamp: number | null;

  constructor(player: Character, options: CommonSkillOptions) {
    const { keyCode, energyUsage, onUse, cooldown, condition } = options;

    this._player = player;
    this._keyCode = keyCode;
    this._cooldown = cooldown;
    this._energyUsage = energyUsage;
    this._onUse = onUse;
    this._condition = condition;
    this._lastUsedTimestamp = null;
  }

  public onUpdate(): void {
    if (userInput.isKeydown(this._keyCode)) {
      this.use();
    }
  }

  /** @returns `true` if used and `false` if was not. */
  public use(
    options: { ignoreCooldown: boolean; applyEnergyUsage: boolean } = {
      ignoreCooldown: false,
      applyEnergyUsage: true,
    }
  ): boolean {
    const { ignoreCooldown, applyEnergyUsage } = options;

    // Check isAvailable
    if (
      ignoreCooldown === false &&
      (this.isNotCooldown() === false || this._condition() === false)
    ) {
      return false;
    }

    // Check isEnoughEnergy
    if (applyEnergyUsage === true && this.isEnoughEnergy() === false) {
      return false;
    }

    this._lastUsedTimestamp = time.timestamp;
    if (applyEnergyUsage === true) this.applyEnergyUsage();
    this._onUse();
    return true;
  }

  public isNotCooldown(): boolean {
    if (this._lastUsedTimestamp === null) return true;

    const isCooldown =
      time.timestamp < this._cooldown() + this._lastUsedTimestamp;
    return isCooldown === false;
  }

  public applyEnergyUsage(): void {
    // FIX ME А если не хватит энергии
    this._player.characteristics.removeEnergy(this._energyUsage());
  }

  public isEnoughEnergy(): boolean {
    return (
      this._player.characteristics.energy.current - this._energyUsage() >= 0
    );
  }

  public get cooldownPercentage(): number {
    if (this._lastUsedTimestamp === null) return 1;
    const elapsedTime = time.timestamp - this._lastUsedTimestamp;
    return Math.min(elapsedTime / this._cooldown(), 1);
  }
}
