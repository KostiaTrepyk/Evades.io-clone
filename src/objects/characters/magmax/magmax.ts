import { Position } from '../../../core/types/Position';
import { time } from '../../../core/global';
import { Character } from '../../character/character';
import { MAGMAXCONFIG } from '../../../configs/characters/magmax.config';
import { ToggleSkill } from '../../character/skills/toggleSkill';

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

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, MAGMAXCONFIG.color.default);

    this.firstSkill = new ToggleSkill(this, {
      keyCode: 'KeyJ',
      cooldown: () => MAGMAXCONFIG.fistSpell.cooldown,
      energyUsage: () => MAGMAXCONFIG.fistSpell.energyUsagePerSecond,
      whenActive: () => {
        if (this.isDead) this.firstSkill.deactivate(time.getTimeStamp);
        this.applySpeedBoost();
      },
      beforeActivation: () => {
        if (this.secondSkill.getIsActive) {
          this.secondSkill.deactivate(time.getTimeStamp);
        }
        this.color = MAGMAXCONFIG.color.firstSpellActive;
      },
      cancelSkill: () => {
        this.color = MAGMAXCONFIG.color.default;
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
        if (this.isDead) this.secondSkill.deactivate(time.getTimeStamp);
        this.applyImmortality();
      },
      beforeActivation: () => {
        // отключает 1 спелл
        if (this.firstSkill.getIsActive) {
          this.firstSkill.deactivate(time.getTimeStamp);
        }

        this.color = MAGMAXCONFIG.color.secondSpellActive;
      },
      cancelSkill: () => {
        this.color = MAGMAXCONFIG.color.default;
      },
      condition: () =>
        this.level.upgrades.secondSpell.current > 0 && !this.isDead,
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);
    this.firstSkill.onUpdate(deltaTime);
    this.secondSkill.onUpdate(deltaTime);
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
