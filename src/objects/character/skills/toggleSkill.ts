import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';

export interface ToggleSkillOptions {
  key: KeyCode;

  /** In milliseconds */
  cooldown: number;

  energyUsage: number;

  whenActive: (deltaTime: number) => void;

  condition?: () => boolean;
}

export class ToggleSkill {
  private player: Character;

  private readonly key: KeyCode;
  private cooldown: ToggleSkillOptions['cooldown'];
  private energyUsage: ToggleSkillOptions['energyUsage'];
  private whenActive: ToggleSkillOptions['whenActive'];
  private lastUsedTimestamp: number;
  private isActive: boolean;

  private conditionUpdater: () => boolean;
  private condition: boolean;

  constructor(player: Character, options: ToggleSkillOptions) {
    const { key, cooldown, energyUsage, whenActive, condition } = options;

    this.player = player;
    this.key = key;
    this.cooldown = Math.max(0, cooldown);
    this.energyUsage = Math.min(0, energyUsage);
    this.whenActive = whenActive;
    this.lastUsedTimestamp = -cooldown / 1000;
    this.isActive = false;

    this.conditionUpdater = condition ?? (() => true);
    this.condition = false;
  }

  public onUpdate(deltaTime: number): void {
    this.condition = this.conditionUpdater();

    if (userInput.isKeydown(this.key)) {
      this.toggle(time.getInGameTime);
    }

    if (this.isActive) {
      this.whenActive(deltaTime);
      this.applyEnergyUsage(deltaTime);
    }
    console.log(this.isAvailable(time.getInGameTime));
  }

  private toggle(currentTimestamp: number): void {
    if (this.isActive) this.deactivate(currentTimestamp);
    else this.activate(currentTimestamp);
  }

  private activate(currentTimestamp: number): void {
    if (!this.isAvailable(currentTimestamp)) return;
    this.isActive = true;
  }

  private deactivate(currentTimestamp: number): void {
    this.isActive = false;
    this.lastUsedTimestamp = currentTimestamp;
  }

  private isAvailable(currentTimestamp: number): boolean {
    if (!this.condition) return false;

    const elapsedTime = currentTimestamp - this.lastUsedTimestamp;
    return elapsedTime >= this.cooldown / 1000;
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

  public get cooldownPersentage(): number {
    const elapsedTime = time.getInGameTime - this.lastUsedTimestamp;
    return Math.min(elapsedTime / (this.cooldown / 1000), 1);
  }
}
