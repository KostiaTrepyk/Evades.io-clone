import { KeyCode } from '../../../core/UserInput';
import { time, userInput } from '../../../core/global';
import { Character } from '../character';
import { ISkill } from './ISkill';

export interface CommonSkillOptions {
  key: KeyCode;

  /** In milliseconds */
  cooldown: number;

  energyUsage: number;

  onUse: () => void;

  condition?: () => boolean;
}

export class CommonSkill implements ISkill {
  private player: Character;

  private readonly key: KeyCode;
  private cooldown: CommonSkillOptions['cooldown'];
  private energyUsage: CommonSkillOptions['energyUsage'];
  private onUse: CommonSkillOptions['onUse'];
  private lastUsedTimestamp: number;

  private conditionUpdater: () => boolean;
  private condition: boolean;

  constructor(player: Character, options: CommonSkillOptions) {
    const { key, cooldown, energyUsage, onUse, condition } = options;

    this.player = player;
    this.key = key;
    this.cooldown = cooldown;
    this.energyUsage = energyUsage;
    this.onUse = onUse;
    this.lastUsedTimestamp = -cooldown / 1000;
    this.conditionUpdater = condition ?? (() => true);
    this.condition = false;
  }

  public onUpdate() {
    this.condition = this.conditionUpdater();

    if (userInput.isKeydown(this.key)) {
      this.use(time.getInGameTime);
    }
  }

  private use(currentTimestamp: number) {
    if (this.isAvailable(currentTimestamp)) {
      this.player.characteristics.energy.current -= this.energyUsage;
      this.lastUsedTimestamp = currentTimestamp;
      this.onUse();
    }
  }

  private isAvailable(currentTimestamp: number): boolean {
    if (!this.condition) return false;

    // Check if enough energy
    if (this.player.characteristics.energy.current - this.energyUsage < 0)
      return false;

    // Check cooldown
    const elapsedTime = currentTimestamp - this.lastUsedTimestamp;
    return elapsedTime >= this.cooldown / 1_000;
  }

  public get cooldownPersentage(): number {
    const elapsedTime = time.getInGameTime - this.lastUsedTimestamp;
    return Math.min(elapsedTime / (this.cooldown / 1000), 1);
  }
}
