import { CHARACTERCONFIG } from '../../configs/characters/character.config';
import { speedPerPoint } from '../../consts/consts';
import { CharacterLevels } from './character.levels';

type StatusName = 'immortal' | 'speedBoost' | 'speedReduction';

export const statusIds = {
  immortality: Symbol('Immortality'),
  speedBoost: Symbol('Speed boost'),
  speedReduction: Symbol('Speed reduction'),
} as const;

export interface Status {
  id: Symbol;
  name: StatusName;
  speed?: number;
  energy?: {
    max?: number;
    regeneration?: number;
  };
}

export class CharacterCharacteristics {
  private readonly characterLevels: CharacterLevels;

  private speed: number;
  private energy: { current: number; max: number; regeneration: number };
  /** Can be used to increase/decrease speed, increase/decrease mana regeneration, etc. */
  private statuses: Status[];

  constructor(characterLevels: CharacterLevels) {
    this.characterLevels = characterLevels;
    this.speed = CHARACTERCONFIG.characteristics.default.speed;
    this.energy = {
      current: CHARACTERCONFIG.characteristics.default.energy.max,
      max: CHARACTERCONFIG.characteristics.default.energy.max,
      regeneration: CHARACTERCONFIG.characteristics.default.energy.regeneration,
    };
    this.statuses = [];
  }

  // FIX ME Не уверен что нужно каждый фрейм обновлять
  public onUpdate(deltaTime: number): void {
    const upgrades = this.characterLevels.upgrades;
    const characteristics = CHARACTERCONFIG.characteristics;

    const defaultSpeed = characteristics.default.speed;
    const speedFromUpgrades =
      characteristics.upgradesPerLevel.speed * upgrades.speed.current;

    const defaultEnergyMax = characteristics.default.energy.max;
    const energyMaxFromUpgrades =
      characteristics.upgradesPerLevel.energy.max * upgrades.maxEnergy.current;

    const defaultEnergyRegeneration =
      characteristics.default.energy.regeneration;
    const energyRegenerationFromUpgrades =
      characteristics.upgradesPerLevel.energy.regeneration *
      upgrades.energyRegeneration.current;

    // Apply upgrades
    this.speed = (defaultSpeed + speedFromUpgrades) * speedPerPoint;
    this.energy.max = defaultEnergyMax + energyMaxFromUpgrades;
    this.energy.regeneration =
      defaultEnergyRegeneration + energyRegenerationFromUpgrades;

    // Apply effects
    this.statuses.forEach((status) => {
      if (status.speed !== undefined)
        this.speed += status.speed * speedPerPoint;
      if (status.energy !== undefined) {
        if (status.energy.max !== undefined)
          this.energy.max += status.energy.max;
        if (status.energy.regeneration !== undefined)
          this.energy.regeneration += status.energy.regeneration;
      }
    });

    // Ensure non-negative values
    this.speed = Math.max(0, this.speed);
    this.energy.max = Math.max(0, this.energy.max);
    this.energy.regeneration = Math.max(0, this.energy.regeneration);

    // Energy regeneration
    if (this.energy.current < this.energy.max) {
      this.energy.current = Math.min(
        this.energy.max,
        this.energy.current + this.energy.regeneration * deltaTime
      );
    }
  }

  public afterUpdate(): void {
    // Reset statuses.
    this.statuses = [];
  }

  // FIX ME Передаём ссылку на объект. Опасно! Но если использовать structuredClone, тогда не будет работать this.removeStatus
  public applyStatus(status: Status): void {
    this.statuses.push(status);
  }

  public removeStatus(id: Symbol): void {
    this.statuses = this.statuses.filter((status) => status.id !== id);
  }

  public isAppliedStatusById(id: Symbol): boolean {
    return Boolean(this.statuses.find((status) => status.id === id));
  }

  /** Возвращает true если энергии хватает и её уже списали. False если не хватает энергии и её на списали. */
  public removeEnergy(energy: number): boolean {
    if (this.energy.current < energy) return false;

    this.energy.current -= energy;
    return true;
  }

  public get getSpeed(): CharacterCharacteristics['speed'] {
    return this.speed;
  }

  public get getEnergy(): CharacterCharacteristics['energy'] {
    return structuredClone(this.energy);
  }
}
