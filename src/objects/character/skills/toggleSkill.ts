import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';

export interface ToggleSkillOptions {
  keyCode: KeyCode;
  cooldown: number;
  energyUsage: number;
  whenActive: (deltaTime: number) => void;
  beforeActivation?: () => void;
  cancelSkill?: () => void;
  condition?: () => boolean;
}

export class ToggleSkill {
  private player: Character;

  private readonly keyCode: KeyCode;
  private cooldown: ToggleSkillOptions['cooldown'];
  private energyUsage: ToggleSkillOptions['energyUsage'];
  /** Применяется каждый кадр если спелл активирован */
  private readonly whenActive: ToggleSkillOptions['whenActive'];
  private readonly beforeActivation: () => void;
  private readonly cancelSkill: () => void;
  private lastUsedTimestamp: number;
  private isActive: boolean;

  private readonly condition: () => boolean;

  constructor(player: Character, options: ToggleSkillOptions) {
    const {
      keyCode,
      cooldown,
      energyUsage,
      whenActive,
      condition,
      beforeActivation,
      cancelSkill,
    } = options;

    this.player = player;
    this.keyCode = keyCode;
    this.cooldown = Math.max(0, cooldown);
    this.energyUsage = Math.max(0, energyUsage);
    this.lastUsedTimestamp = -cooldown;
    this.isActive = false;

    this.whenActive = whenActive;
    this.beforeActivation = beforeActivation ?? (() => {});
    this.cancelSkill = cancelSkill ?? (() => {});
    this.condition = condition ?? (() => true);
  }

  public onUpdate(deltaTime: number): void {
    if (userInput.isKeydown(this.keyCode)) {
      this.toggle(time.getInGameTime);
    }

    if (this.isActive) {
      this.whenActive(deltaTime);
      this.applyEnergyUsage(deltaTime);
    }
  }

  private toggle(timestamp: number): void {
    if (this.isActive) this.deactivate(timestamp);
    else this.activate(timestamp);
  }

  public activate(timestamp: number): void {
    if (!this.isAvailable(timestamp)) return;
    this.isActive = true;
    this.beforeActivation();
  }

  public deactivate(timestamp: number): void {
    this.isActive = false;
    this.lastUsedTimestamp = timestamp;
    this.cancelSkill();
  }

  private isAvailable(currentTimestamp: number): boolean {
    if (!this.condition()) return false;

    const elapsedTime = currentTimestamp - this.lastUsedTimestamp;
    return elapsedTime >= this.cooldown;
  }

  public applyEnergyUsage(deltaTime: number): void {
    const playerEnergy = this.player.characteristics.energy.current;
    const needsEnergy = this.energyUsage * deltaTime;

    if (playerEnergy - needsEnergy <= 0) {
      this.deactivate(time.getInGameTime);
      return;
    }

    this.player.characteristics.energy.current -= this.energyUsage * deltaTime;
  }

  public get getIsActive(): boolean {
    return this.isActive;
  }

  public set setCoolDown(newCoolDown: number) {
    this.cooldown = newCoolDown;
  }

  public set setEnergyUsage(newEnergyUsage: number) {
    this.energyUsage = newEnergyUsage;
  }

  public get cooldownPercentage(): number {
    const elapsedTime = time.getInGameTime - this.lastUsedTimestamp;
    return Math.min(elapsedTime / this.cooldown, 1);
  }
}
