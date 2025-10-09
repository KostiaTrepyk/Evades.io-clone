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
  private player: Character;

  private readonly keyCode: KeyCode;
  private cooldown: CommonSkillOptions['cooldown'];
  private energyUsage: CommonSkillOptions['energyUsage'];
  private onUse: CommonSkillOptions['onUse'];
  private condition: CommonSkillOptions['condition'];
  private lastUsedTimestamp: number;

  constructor(player: Character, options: CommonSkillOptions) {
    const { keyCode, energyUsage, onUse, cooldown, condition } = options;

    this.player = player;
    this.keyCode = keyCode;
    this.cooldown = cooldown;
    this.energyUsage = energyUsage;
    this.onUse = onUse;
    this.condition = condition;
    this.lastUsedTimestamp = 0;
  }

  public onUpdate(): void {
    if (userInput.isKeydown(this.keyCode)) {
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
    if (ignoreCooldown === false && this.isNotCooldown() === false) {
      return false;
    }

    // Check isEnoughEnergy
    if (applyEnergyUsage === true && this.isEnoughEnergy() === false) {
      return false;
    }

    this.lastUsedTimestamp = time.timestamp;
    if (applyEnergyUsage === true) this.applyEnergyUsage();
    this.onUse();
    return true;
  }

  public isNotCooldown(): boolean {
    const isCooldown =
      time.timestamp < this.cooldown() * 1000 + this.lastUsedTimestamp;
    return isCooldown === false && this.condition();
  }

  public applyEnergyUsage(): void {
    // FIX ME А если не хватит энергии
    this.player.characteristics.removeEnergy(this.energyUsage());
  }

  public isEnoughEnergy(): boolean {
    return (
      this.player.characteristics.getEnergy.current - this.energyUsage() >= 0
    );
  }

  public get cooldownPercentage(): number {
    const elapsedTime = (time.timestamp - this.lastUsedTimestamp) / 1000;
    return Math.min(elapsedTime / this.cooldown(), 1);
  }
}
