import { CHARACTERCONFIG } from '../../configs/characters/character.config';
import { speedPerPoint } from '../../consts/consts';
import { MStatus } from '../../core/modules/status/MStatus';
import { CharacterLevels } from './character.levels';

const statusNames = [
  'immortal',
  'speedBoost',
  'speedReduction',
  'energyRegenerationReduction',
] as const;
type StatusName = (typeof statusNames)[number];

interface Effect {
  speed?: {
    type: 'number' | 'percentage';
    value: number;
  };
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
  public MStatus: MStatus<StatusName, Effect>;

  constructor(characterLevels: CharacterLevels) {
    this.characterLevels = characterLevels;
    this.speed = CHARACTERCONFIG.characteristics.default.speed;
    this.energy = {
      current: CHARACTERCONFIG.characteristics.default.energy.max,
      max: CHARACTERCONFIG.characteristics.default.energy.max,
      regeneration: CHARACTERCONFIG.characteristics.default.energy.regeneration,
    };
    this.MStatus = new MStatus({ availableStatusNames: statusNames });
  }

  // FIX ME Не уверен что нужно каждый фрейм обновлять
  // FIX ME Читабельность говно. Ещё и странно работает.
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
    this.MStatus.statuses.forEach((status) => {
      if (status.effects === undefined) return;

      const { speed, energy } = status.effects;

      if (speed !== undefined) {
        if (speed.type === 'number') {
          this.speed = this.speed + speed.value * speedPerPoint;
        } else if (speed.type === 'percentage') {
          this.speed = this.speed * speed.value;
        }
      }
      if (energy !== undefined) {
        if (energy.max !== undefined) this.energy.max += energy.max;
        if (energy.regeneration !== undefined)
          this.energy.regeneration += energy.regeneration;
      }
    });

    const { speed, energy } = this.calculateCharacteristics();

    // Ensure non-negative values
    this.speed = Math.max(0, speed);
    this.energy.max = Math.max(0, energy.max);
    // this.energy.regeneration = Math.max(0, this.energy.regeneration); Может быть на минусе.

    // Energy regeneration
    this.energy.current = Math.min(
      this.energy.max,
      Math.max(this.energy.current + energy.regeneration * deltaTime, 0)
    );
  }

  private calculateCharacteristics(): {
    speed: number;
    energy: { max: number; regeneration: number };
  } {
    const upgrades = this.characterLevels.upgrades;
    const characteristics = CHARACTERCONFIG.characteristics;

    const defaultSpeed: number = characteristics.default.speed;
    const speedFromUpgrades =
      characteristics.upgradesPerLevel.speed * upgrades.speed.current;
    const speedWithUpgrades =
      (defaultSpeed + speedFromUpgrades) * speedPerPoint;

    const defaultEnergyMax = characteristics.default.energy.max;
    const energyMaxWithUpgrades =
      defaultEnergyMax +
      characteristics.upgradesPerLevel.energy.max * upgrades.maxEnergy.current;

    const defaultEnergyRegeneration =
      characteristics.default.energy.regeneration;
    const energyRegenerationWithUpgrades =
      defaultEnergyRegeneration +
      characteristics.upgradesPerLevel.energy.regeneration *
        upgrades.energyRegeneration.current;

    let speedWithEffects = speedWithUpgrades;
    let energyWithEffects = {
      max: energyMaxWithUpgrades,
      regeneration: energyRegenerationWithUpgrades,
    };

    this.MStatus.statuses.forEach((status) => {
      if (status.effects === undefined) return;

      const { speed, energy } = status.effects;

      if (speed !== undefined) {
        if (speed.type === 'number') {
          speedWithEffects = speedWithEffects + speed.value * speedPerPoint;
        } else if (speed.type === 'percentage') {
          speedWithEffects = speedWithEffects * speed.value;
        }
      }
      if (energy !== undefined) {
        if (energy.max !== undefined) energyWithEffects.max += energy.max;
        if (energy.regeneration !== undefined)
          energyWithEffects.regeneration += energy.regeneration;
      }
    });

    return { speed: speedWithEffects, energy: energyWithEffects };
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
