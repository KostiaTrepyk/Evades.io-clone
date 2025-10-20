import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { MAGMAXCONFIG } from '../../../configs/characters/magmax.config';
import { ToggleSkill } from '../../character/skills/toggleSkill';

const magmaxFirstSkillId = Symbol('Magmax speed boost');
const magmaxSecondSkillId = Symbol('Magmax immortality');

export class Magmax extends Character {
  public override firstSkill: ToggleSkill;
  public override secondSkill: ToggleSkill;

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

  constructor(startPosition: Position) {
    super(startPosition, MAGMAXCONFIG.size, MAGMAXCONFIG.color.default);

    this.firstSkill = new ToggleSkill(this, {
      keyCode: 'KeyJ',
      cooldown: () => MAGMAXCONFIG.fistSpell.cooldown,
      energyUsage: () => MAGMAXCONFIG.fistSpell.energyUsagePerSecond,
      whenActive: () => {
        if (this.isDead) this.firstSkill.deactivate();
        this.applySpeedBoost();
      },
      beforeActivation: () => {
        if (this.secondSkill.getIsActive) {
          this.secondSkill.deactivate();
        }
        this.color.current = MAGMAXCONFIG.color.firstSpellActive.clone();
      },
      cancelSkill: () => {
        this.removeSpeedBoost();
      },
      condition: () =>
        this.level.upgrades.firstSpell.current > 0 && !this.isDead,
    });

    this.secondSkill = new ToggleSkill(this, {
      keyCode: 'KeyK',
      cooldown: () => {
        return this.spellsUpgrades.second.cooldown[
          Math.max(0, this.level.upgrades.secondSpell.current - 1)
        ];
      },
      energyUsage: () => MAGMAXCONFIG.secondSpell.energyUsagePerSecond,
      whenActive: () => {
        if (this.isDead) this.secondSkill.deactivate();
        this.applyImmortality();
      },
      beforeActivation: () => {
        // отключает 1 спелл
        if (this.firstSkill.getIsActive) {
          this.firstSkill.deactivate();
        }

        this.color.current = MAGMAXCONFIG.color.secondSpellActive.clone();
      },
      cancelSkill: () => {
        this.removeImmortality();
      },
      condition: () =>
        this.level.upgrades.secondSpell.current > 0 && !this.isDead,
    });
  }

  public override die(): void {
    super.die();

    if (this.characteristics.MStatus.isAppliedStatusByName('immortal')) return;
    this.firstSkill.deactivate();
    this.secondSkill.deactivate();
  }

  private applySpeedBoost(): void {
    const speedBoost =
      this.spellsUpgrades.first.speed[
        this.level.upgrades.firstSpell.current - 1
      ];

    this.characteristics.MStatus.applyStatus({
      id: magmaxFirstSkillId,
      name: 'speedBoost',
      effects: { speed: { type: 'number', value: speedBoost } },
    });
  }

  private removeSpeedBoost(): void {
    this.color.current = this.color.default.clone();
    this.characteristics.MStatus.removeStatus(magmaxFirstSkillId);
  }

  private applyImmortality(): void {
    this.characteristics.MStatus.applyStatus({
      id: magmaxSecondSkillId,
      name: 'immortal',
      effects: { speed: { type: 'percentage', value: 0 } },
    });
  }

  private removeImmortality(): void {
    this.color.current = this.color.default.clone();
    this.characteristics.MStatus.removeStatus(magmaxSecondSkillId);
  }
}
