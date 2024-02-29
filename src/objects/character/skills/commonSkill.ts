import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';
import { ISkill } from './ISkill';

export interface CommonSkillOptions {
  key: KeyCode;
  energyUsage: number;
  onUse: () => void;
}

export class CommonSkill implements ISkill {
  private player: Character;

  private readonly key: KeyCode;
  private cooldown: { from: number; duration: number };
  private energyUsage: CommonSkillOptions['energyUsage'];
  private onUse: CommonSkillOptions['onUse'];
  private lastUsedTimestamp: number;

  constructor(player: Character, options: CommonSkillOptions) {
    const { key, energyUsage, onUse } = options;

    this.player = player;
    this.key = key;
    this.cooldown = { from: 0, duration: 0 };
    this.energyUsage = Math.max(0, energyUsage);
    this.onUse = onUse;
    this.lastUsedTimestamp = 0;
  }

  public onUpdate(): void {
    if (userInput.isKeydown(this.key)) {
      this.use();
    }
  }

  /** @returns `true` if used and `false` if was not. */
  public use(
    options: { ignoreCooldown?: boolean; applyEnergyUsage?: boolean } = {
      ignoreCooldown: false,
      applyEnergyUsage: false,
    }
  ): boolean {
    const { ignoreCooldown, applyEnergyUsage } = options;

    // Check isAvailable
    if (!this.isAvailable() && !ignoreCooldown) return false;

    // Check isEnoughEnergy
    if (applyEnergyUsage) {
      const isEnoughEnergy = this.applyEnergyUsage();
      if (!isEnoughEnergy) return false;
    }

    this.lastUsedTimestamp = time.getInGameTime;
    this.onUse();
    return true;
  }

  public isAvailable(): boolean {
    const cooldownDurationInSeconds = this.cooldown.duration;

    return time.getInGameTime >= this.cooldown.from + cooldownDurationInSeconds;
  }

  public applyEnergyUsage(): boolean {
    if (this.isEnoughEnergy()) {
      this.player.characteristics.energy.current -= this.energyUsage;
      return true;
    }
    return false;
  }

  public isEnoughEnergy(): boolean {
    return this.player.characteristics.energy.current - this.energyUsage >= 0;
  }

  public get getLastUsedTimestamp(): number {
    return this.lastUsedTimestamp;
  }

  public get cooldownPersentage(): number {
    const elapsedTime = time.getInGameTime - this.cooldown.from;
    const percentage = elapsedTime / this.cooldown.duration;
    return Math.min(Math.max(percentage, 0), 1);
  }

  public set setCooldown(seconds: number) {
    this.cooldown.from = time.getInGameTime;
    this.cooldown.duration = seconds;
  }

  public resetCooldown(): void {
    this.cooldown.from = 0;
    this.cooldown.duration = 0;
  }
}
