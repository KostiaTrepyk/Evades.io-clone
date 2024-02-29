import { HSLA } from '../../../core/helpers/hsla';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { ISkill } from '../../character/skills/ISkill';
import { ToggleSkill } from '../../character/skills/toggleSkill';

export class Magmax extends Character {
  public override firstSkill: ISkill;
  public override secondSkill: ISkill;

  private spellsUpgrades = {
    first: { manaUsage: 2, speed: [2, 4, 6, 8, 10] },
    second: { manaUsage: 12 },
  };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, new HSLA(0, 85, 50, 100));
    this.firstSkill = new ToggleSkill(this, {
      key: 'KeyJ',
      cooldown: 0,
      energyUsage: 2,
      whenActive: this.applySpeedBoost.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.firstSpell.current <= 0) return false;
        return true;
      },
    });
    this.secondSkill = new ToggleSkill(this, {
      key: 'KeyK',
      cooldown: 5,
      energyUsage: 12,
      whenActive: this.applyImmortality.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this.firstSkill.onUpdate(deltaTime);
    this.secondSkill.onUpdate(deltaTime);
  }

  private applySpeedBoost(deltaTime: number) {
    this.characteristics.applyEffect(
      {
        speed:
          this.spellsUpgrades.first.speed[
            this.level.upgrades.firstSpell.current - 1
          ],
      },
      'speedBoost'
    );
    this.characteristics.energy.current -=
      this.spellsUpgrades.first.manaUsage * deltaTime;
  }

  private applyImmortality(deltaTime: number) {
    this.characteristics.energy.current -=
      this.spellsUpgrades.second.manaUsage * deltaTime;
    this.characteristics.applyEffect({ speed: -9999 }, 'immortal');
  }
}
