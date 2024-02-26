import { KeyCode } from '../../../core/UserInput';
import { userInput } from '../../../core/global';
import { Character } from '../character';

export interface ToggleSkillOptions {
  key: KeyCode;
  /** In milliseconds */
  cooldown: number;
  energyUsage: number;
  whenActive: (deltaTime: number) => void;
}

export class ToggleSkill {
  private player: Character;

  private readonly key: KeyCode;
  private cooldown: ToggleSkillOptions['cooldown'];
  private energyUsage: ToggleSkillOptions['energyUsage'];
  private whenActive: ToggleSkillOptions['whenActive'];
  private lastUsedTimestamp: number;
  private isActive: boolean;

  constructor(player: Character, options: ToggleSkillOptions) {
    const { key, cooldown, energyUsage, whenActive } = options;

    this.player = player;
    this.key = key;
    this.cooldown = Math.max(0, cooldown);
    this.energyUsage = Math.min(0, energyUsage);
    this.whenActive = whenActive;
    this.lastUsedTimestamp = 0;
    this.isActive = false;
  }

  public onUpdate(deltaTime: number): void {
    if (userInput.isKeydown(this.key)) {
      this.toggle(this.cooldown);
    }

    if (this.isActive) {
      this.whenActive(deltaTime);
      this.applyEnergyUsage(deltaTime);
    }
  }

  private activate(currentTimestamp: number): void {
    if (!this.isAvailable(currentTimestamp)) return;
    this.isActive = true;
  }

  private deactivate(currentTimestamp: number): void {
    this.isActive = false;
    this.lastUsedTimestamp = currentTimestamp;
  }

  private toggle(currentTimestamp: number): void {
    if (this.isActive) this.deactivate(currentTimestamp);
    else this.activate(currentTimestamp);
  }

  private isAvailable(currentTimestamp: number): boolean {
    if (this.cooldown <= 0) return true;

    const elapsedTime = currentTimestamp - this.lastUsedTimestamp;
    return elapsedTime >= this.cooldown;
  }

  private applyEnergyUsage(deltaTime: number) {
    if (
      this.player.characteristics.energy.current -
        this.energyUsage * deltaTime >
      0
    ) {
      this.player.characteristics.energy.current -=
        this.energyUsage * deltaTime;
    } else {
      this.isActive = false;
    }
  }

  public get isActives(): boolean {
    return this.isActive;
  }
}
