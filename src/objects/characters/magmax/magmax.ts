import { Position } from '../../../core/types/Position';
import { time } from '../../../core/global';
import { Character } from '../../character/character';
import { MAGMAXCONFIG } from '../../../configs/characters/magmax.config';
import { ToggleSkill } from '../../character/skills/toggleSkill';
import { statusIds } from '../../character/character.characteristics';

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
        this.color = MAGMAXCONFIG.color.firstSpellActive;
      },
      cancelSkill: () => {
        this.color = MAGMAXCONFIG.color.default;
        this.characteristics.removeStatus(statusIds.speedBoost);
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

        this.color = MAGMAXCONFIG.color.secondSpellActive;
      },
      cancelSkill: () => {
        this.color = MAGMAXCONFIG.color.default;
        this.characteristics.removeStatus(statusIds.immortality);
      },
      condition: () =>
        this.level.upgrades.secondSpell.current > 0 && !this.isDead,
    });
  }

  private applySpeedBoost() {
    const speedBoost =
      this.spellsUpgrades.first.speed[
        this.level.upgrades.firstSpell.current - 1
      ];

    this.characteristics.applyStatus({
      id: statusIds.speedBoost,
      name: 'speedBoost',
      speed: speedBoost,
    });
  }

  private applyImmortality() {
    this.characteristics.applyStatus({
      id: statusIds.immortality,
      name: 'immortal',
      speed: -9999,
    });
  }
}
