import { HSLA } from '../../../core/utils/hsla';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonskill';

export class Magmax extends Character {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;

  private isFirstSkillActive: boolean;
  private isSecondSkillActive: boolean;

  private spellsUpgrades = {
    first: { energyUsage: 2, speed: [2, 4, 6, 8, 10] },
    second: { energyUsage: 12, cooldown: [2, 1.5, 1.2, 0.7, 0.3] },
  };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, new HSLA(0, 85, 50, 100));
    this.firstSkill = new CommonSkill(this, {
      key: 'KeyJ',
      energyUsage: 2,
      onUse: this.firstSkillHandler.bind(this),
    });
    this.secondSkill = new CommonSkill(this, {
      key: 'KeyK',
      energyUsage: 12,
      onUse: this.secondSkillHandler.bind(this),
    });
    this.isFirstSkillActive = false;
    this.isSecondSkillActive = false;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this.firstSkill.onUpdate();
    this.secondSkill.onUpdate();

    if (this.isFirstSkillActive) this.applyFirstSkill(deltaTime);
    if (this.isSecondSkillActive) this.applySecondSkill(deltaTime);
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
      this.secondSkill.setCooldown =
        this.spellsUpgrades.second.cooldown[skillLevel - 1];
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
    } else {
      this.isFirstSkillActive = false;
    }
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
    } else {
      this.isSecondSkillActive = false;
    }
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
