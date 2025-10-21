import { CHARACTERCONFIG } from '../../configs/characters/character.config';
import { speedPerPoint } from '../../consts/consts';
import { Module } from '../../core/common/Module';
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

export class CharacterCharacteristics implements Module {
  private readonly CharacterLevels: CharacterLevels;

  private _speed: number;
  private _energy: { current: number; max: number; regeneration: number };
  /** Can be used to increase/decrease speed, increase/decrease mana regeneration, etc. */
  public MStatus: MStatus<StatusName, Effect>;

  constructor(characterLevels: CharacterLevels) {
    this.CharacterLevels = characterLevels;
    this._speed = CHARACTERCONFIG.characteristics.default.speed;
    this._energy = {
      current: CHARACTERCONFIG.characteristics.default.energy.max,
      max: CHARACTERCONFIG.characteristics.default.energy.max,
      regeneration: CHARACTERCONFIG.characteristics.default.energy.regeneration,
    };
    this.MStatus = new MStatus({ availableStatusNames: statusNames });
  }

  // FIX ME Читабельность говно. Ещё и странно работает.
  public beforeUpdate(deltaTime: number): void {
    const upgrades = this.CharacterLevels.upgrades;
    const defaultCharacteristics = CHARACTERCONFIG.characteristics.default;
    const upgradesPerLevel = CHARACTERCONFIG.characteristics.upgradesPerLevel;

    const defaultSpeed = defaultCharacteristics.speed;
    const speedFromUpgrades = upgradesPerLevel.speed * upgrades.speed.current;

    const defaultEnergyMax = defaultCharacteristics.energy.max;
    const energyMaxFromUpgrades =
      upgradesPerLevel.energy.max * upgrades.maxEnergy.current;

    const defaultEnergyRegeneration =
      defaultCharacteristics.energy.regeneration;
    const energyRegenerationFromUpgrades =
      upgradesPerLevel.energy.regeneration *
      upgrades.energyRegeneration.current;

    // Apply upgrades
    this._speed = (defaultSpeed + speedFromUpgrades) * speedPerPoint;
    this._energy.max = defaultEnergyMax + energyMaxFromUpgrades;
    this._energy.regeneration =
      defaultEnergyRegeneration + energyRegenerationFromUpgrades;

    // Apply effects
    this.MStatus.statuses.forEach((status) => {
      if (status.effects === undefined) return;

      const { speed, energy } = status.effects;

      if (speed !== undefined) {
        if (speed.type === 'number') {
          this._speed = this._speed + speed.value * speedPerPoint;
        } else if (speed.type === 'percentage') {
          this._speed = this._speed * speed.value;
        }
      }
      if (energy !== undefined) {
        if (energy.max !== undefined) this._energy.max += energy.max;
        if (energy.regeneration !== undefined)
          this._energy.regeneration += energy.regeneration;
      }
    });

    const { speed, energy } = this.calculateCharacteristics();

    // Ensure non-negative values
    this._speed = Math.max(0, speed);
    this._energy.max = Math.max(0, energy.max);
    // this.energy.regeneration = Math.max(0, this.energy.regeneration); Может быть на минусе.

    // Energy regeneration
    this._energy.current = Math.min(
      this._energy.max,
      Math.max(this._energy.current + energy.regeneration * deltaTime, 0)
    );
  }

  public onUpdate(deltaTime: number): void {
    this.MStatus.onUpdate(deltaTime);
  }

  private calculateCharacteristics(): {
    speed: number;
    energy: { max: number; regeneration: number };
  } {
    const upgrades = this.CharacterLevels.upgrades;
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
    if (this._energy.current < energy) return false;

    this._energy.current -= energy;
    return true;
  }

  public get speed(): CharacterCharacteristics['_speed'] {
    return this._speed;
  }

  public get energy(): CharacterCharacteristics['_energy'] {
    return structuredClone(this._energy);
  }
}
