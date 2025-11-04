import type { ISkill } from './ISkill';

import type { KeyCode } from '@core/UserInput';
import { userInput, time } from '@core/global';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';

// FIX ME Теоретически beforeActivation и whenActive это тоже самое (выполняются по очереди но всё можно написать в одном из них.)
export interface ToggleSkillOptions {
  keyCode: KeyCode;
  cooldown: () => number;
  energyUsage: () => number;
  beforeActivation?: () => void;
  whenActive: () => void;
  cancelSkill?: () => void;
  condition?: () => boolean;
}

export class ToggleSkill implements ISkill {
  private readonly player: CharacterBase;

  private readonly keyCode: KeyCode;
  private readonly cooldown: ToggleSkillOptions['cooldown'];
  private readonly energyUsage: ToggleSkillOptions['energyUsage'];
  private readonly whenActive: ToggleSkillOptions['whenActive'];
  private readonly beforeActivation: () => void;
  private readonly cancelSkill: () => void;
  private lastUsedTimestamp: number;
  private isActive: boolean;

  private readonly condition: () => boolean;

  constructor(player: CharacterBase, options: ToggleSkillOptions) {
    const { keyCode, cooldown, energyUsage, whenActive, condition, beforeActivation, cancelSkill } =
      options;

    this.player = player;
    this.keyCode = keyCode;
    this.cooldown = cooldown;
    this.energyUsage = energyUsage;
    this.lastUsedTimestamp = -cooldown();
    this.isActive = false;

    this.whenActive = whenActive;
    this.beforeActivation = beforeActivation ?? (() => {});
    this.cancelSkill = cancelSkill ?? (() => {});
    this.condition = condition ?? (() => true);
  }

  public onUpdate(): void {
    if (userInput.isKeydown(this.keyCode)) {
      this.toggle(time.deltaTime);
    }

    if (this.isActive) {
      const isEnoughEnergy = this.applyContinuousEnergyUsage(time.deltaTime);
      if (isEnoughEnergy === false) this.deactivate();
    }
  }

  private toggle(deltaTime: number): void {
    if (this.isActive) this.deactivate();
    else this.activate(deltaTime);
  }

  public activate(deltaTime: number): void {
    if (this.isAvailable(deltaTime) === false) return;
    this.isActive = true;
    this.beforeActivation();
    this.whenActive();
  }

  public deactivate(): void {
    this.isActive = false;
    this.lastUsedTimestamp = time.timestamp;
    this.cancelSkill();
  }

  private isAvailable(deltaTime: number): boolean {
    if (this.condition() === false) return false;

    const elapsedTime = time.timestamp - this.lastUsedTimestamp;
    const isNotCooldown: boolean = elapsedTime >= this.cooldown();

    const playerEnergy = this.player.characteristics.energy.current;
    const needsEnergy = this.energyUsage() * deltaTime;
    const isEnoughEnergy: boolean = playerEnergy - needsEnergy >= 0;

    return isNotCooldown && isEnoughEnergy;
  }

  /** Returns false if not enough energy */
  public applyContinuousEnergyUsage(deltaTime: number): boolean {
    const isEnoughEnergy: boolean = this.player.characteristics.removeEnergy(
      this.energyUsage() * deltaTime,
    );

    if (isEnoughEnergy) return true;
    return false;
  }

  public get getIsActive(): boolean {
    return this.isActive;
  }

  public get cooldownPercentage(): number {
    const elapsedTime = time.timestamp - this.lastUsedTimestamp;
    return Math.min(elapsedTime / this.cooldown(), 1);
  }
}
