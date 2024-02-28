import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';

export interface SkillOptions {
  key: KeyCode;

  energyUsage: number;

  onUse: (deltaTime: number) => void;

  // cb to update condition
  condition?: () => boolean;
}

export class Skill {
  private player: Character;

  private readonly key: KeyCode;
  private cooldown: { from: number; duration: number };
  private energyUsage: SkillOptions['energyUsage'];
  private onUse: SkillOptions['onUse'];
  private lastUsedTimestamp: number;
  private conditionUpdater: () => boolean;
  private condition: boolean;

  constructor(player: Character, options: SkillOptions) {
    const { key, energyUsage, onUse: whenActive, condition } = options;

    this.player = player;
    this.key = key;
    this.cooldown = { from: 0, duration: 0 };
    this.energyUsage = Math.min(0, energyUsage);
    this.onUse = whenActive;
    this.lastUsedTimestamp = 0;
    this.conditionUpdater = condition ?? (() => true);
    this.condition = false;
  }

  public onUpdate(deltaTime: number): void {
    this.condition = this.conditionUpdater();

    if (userInput.isKeydown(this.key)) {
      this.tryUse(deltaTime);
    }
  }

  /** @returns `true` if used and `false` if was not. */
  public tryUse(deltaTime: number): boolean {
    if (this.isAvailable()) {
      this.lastUsedTimestamp = time.getInGameTime;
      this.onUse(deltaTime);
      return true;
    }
    return false;
  }

  public isAvailable(): boolean {
    if (!this.condition) return false;

    const cooldownDurationInSeconds = this.cooldown.duration / 1_000;

    return time.getInGameTime >= this.cooldown.from + cooldownDurationInSeconds;
  }

  /** Needs fix */
  public applyEnergyUsage(deltaTime: number): boolean {
    if (
      this.player.characteristics.energy.current -
        this.energyUsage * deltaTime >
      0
    ) {
      this.player.characteristics.energy.current -=
        this.energyUsage * deltaTime;
      return true;
    }
    return false;
  }

  public get cooldownPersentage(): number {
    const elapsedTime = time.getInGameTime - this.cooldown.from;
    return Math.min(elapsedTime / (this.cooldown.duration / 1000), 1);
  }

  public set setCooldown(milliseconds: number) {
    this.cooldown.from = time.getInGameTime;
    this.cooldown.duration = milliseconds;
  }
}
