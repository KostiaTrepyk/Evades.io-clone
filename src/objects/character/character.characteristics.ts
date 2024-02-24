import { Character } from "./character";
import { characterSpeedPerPoint } from "../../consts/consts";

type Status = "immortal" | "speedBoost";

export class CharacterCharacteristics {
  private player: Character;
  public speed: number;
  public energy: { current: number; max: number; regen: number };

  /** Can be used to increase/decrease speed, increase/decrease mana regeneration, etc. Remember to apply the correct status. */
  public effects: { speed: number; energy: { max: number; regen: number } };
  public statuses: Status[];

  constructor(player: Character) {
    this.player = player;
    this.speed = 5;
    this.energy = { current: 30, max: 30, regen: 2 };
    this.statuses = [];
    this.effects = { speed: 0, energy: { max: 0, regen: 0 } };
  }

  public onUpdate(deltaTime: number) {
    const upgrades = this.player.level.upgrades;

    // Apply upgrades
    this.speed = (5 + 1 * upgrades.speed.current) * characterSpeedPerPoint;
    this.energy.max = 30 + 5 * upgrades.maxEnergy.current;
    this.energy.regen = 1 + 0.2 * upgrades.regen.current;

    // Apply effects
    this.speed += this.effects.speed * characterSpeedPerPoint;
    this.energy.max += this.effects.energy.max;
    this.energy.regen += this.effects.energy.regen;

    // Ensure non-negative values
    this.speed = Math.max(0, this.speed);
    this.energy.max = Math.max(0, this.energy.max);
    this.energy.regen = Math.max(0, this.energy.regen);

    // Energy regeneration
    if (this.energy.current < this.energy.max) {
      this.energy.current = Math.min(
        this.energy.max,
        this.energy.current + this.energy.regen * deltaTime
      );
    }
  }

  /* Reset effects and statuses */
  public reset(): void {
    this.effects = { speed: 0, energy: { max: 0, regen: 0 } };
    this.statuses = [];
  }

  public applyEffect(
    effect: {
      speed?: number;
      energy?: { max?: number; regen?: number };
    },
    status: Status
  ): void {
    this.statuses.push(status);

    if (effect.speed !== undefined) {
      this.effects.speed += effect.speed;
    }

    if (effect.energy !== undefined) {
      if (effect.energy.max !== undefined) {
        this.effects.energy.max += effect.energy.max;
      }

      if (effect.energy.regen !== undefined) {
        this.effects.energy.regen += effect.energy.regen;
      }
    }
  }
}
