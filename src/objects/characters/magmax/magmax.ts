import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonSkill';
import { MAGMAXCONFIG } from '../../../configs/characters/magmax.config';
import { userInput } from '../../../core/global';

export class Magmax extends Character {
  /* Без этого не работает UI. Нужно переделать что-бы это убрать. */
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;

  private isFirstSkillActive: boolean = false;
  private isSecondSkillActive: boolean = false;

  private spellsUpgrades = {
    first: {
      energyUsage: MAGMAXCONFIG.fistSpell.energyUsagePerSecond,
      speed: MAGMAXCONFIG.fistSpell.speed,
    },
    second: {
      energyUsage: MAGMAXCONFIG.secondSpell.energyUsagePerSecond,
      cooldown: MAGMAXCONFIG.secondSpell.cooldown,
    },
  };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, MAGMAXCONFIG.color.default);

    /* Без этого не работает UI. Нужно переделать что-бы это убрать. */
    this.firstSkill = new CommonSkill(this, {
      keyCode: 'KeyJ',
      energyUsage: 0,
      onUse: () => {},
    });
    this.secondSkill = new CommonSkill(this, {
      keyCode: 'KeyK',
      energyUsage: 0,
      onUse: () => {},
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    if (userInput.isKeydown('KeyJ')) this.firstSkillHandler();

    if (this.isFirstSkillActive) this.applyFirstSkill(deltaTime);

    if (userInput.isKeydown('KeyK')) this.secondSkillHandler();

    if (this.isSecondSkillActive) this.applySecondSkill(deltaTime);

    if (!this.isFirstSkillActive && !this.isSecondSkillActive)
      this.cancelSecondSkill();
  }

  private applyContinuousEnergyUsage(
    deltaTime: number,
    energyUsage: number
  ): boolean {
    if (this.characteristics.energy.current - energyUsage * deltaTime >= 0) {
      this.characteristics.energy.current -= energyUsage * deltaTime;
      return true;
    }
    return false;
  }

  private isEnoughEnergy(
    options:
      | { type: 'deffault'; energyUsage: number }
      | { type: 'continuous'; energyUsage: number; deltaTime: number }
  ): boolean {
    switch (options.type) {
      case 'deffault':
        if (this.characteristics.energy.current - options.energyUsage >= 0)
          return true;
        break;
      case 'continuous':
        const needEnergy = options.energyUsage * options.deltaTime;
        if (this.characteristics.energy.current - needEnergy >= 0) return true;
        break;
      default:
        throw new Error('Unknown type');
    }
    return false;
  }

  private firstSkillHandler(): void {
    if (this.isDead) return;
    if (this.level.upgrades.firstSpell.current <= 0) return;

    if (this.isFirstSkillActive) {
      this.isFirstSkillActive = false;
    } else {
      this.isFirstSkillActive = true;
      this.isSecondSkillActive = false;
    }
  }

  private secondSkillHandler(): void {
    const skillLevel = this.level.upgrades.secondSpell.current;

    if (this.isDead) return;
    if (skillLevel <= 0) return;

    if (this.isSecondSkillActive) {
      this.isSecondSkillActive = false;
    } else {
      this.isSecondSkillActive = true;
      this.isFirstSkillActive = false;
    }
  }

  private applyFirstSkill(deltaTime: number): void {
    if (
      this.isEnoughEnergy({
        type: 'continuous',
        deltaTime,
        energyUsage: this.spellsUpgrades.first.energyUsage,
      })
    ) {
      this.applySpeedBoost();
      this.applyContinuousEnergyUsage(
        deltaTime,
        this.spellsUpgrades.first.energyUsage
      );
      this.color = MAGMAXCONFIG.color.firstSpellActive;
    } else {
      this.isFirstSkillActive = false;
    }
  }

  private cancelFirstSkill(): void {
    this.color = MAGMAXCONFIG.color.default;
  }

  private applySecondSkill(deltaTime: number): void {
    if (
      this.isEnoughEnergy({
        type: 'continuous',
        energyUsage: this.spellsUpgrades.second.energyUsage,
        deltaTime,
      })
    ) {
      this.applyImmortality();
      this.applyContinuousEnergyUsage(
        deltaTime,
        this.spellsUpgrades.second.energyUsage
      );
      this.color = MAGMAXCONFIG.color.secondSpellActive;
    } else {
      this.isSecondSkillActive = false;
    }
  }

  private cancelSecondSkill(): void {
    this.color = MAGMAXCONFIG.color.default;
  }

  private applySpeedBoost() {
    this.characteristics.applyEffect(
      {
        speed:
          this.spellsUpgrades.first.speed[
            this.level.upgrades.firstSpell.current - 1
          ],
      },
      'speedBoost'
    );
  }

  private applyImmortality() {
    this.characteristics.applyEffect({ speed: -9999 }, 'immortal');
  }
}
