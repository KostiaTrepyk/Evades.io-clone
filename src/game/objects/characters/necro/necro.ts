import { NecroFirstSpellProjectile } from './firstSpellProjectile';

import { NECROCONFIG } from '@config/objects/characters/necro.config';
import { CharacterBase } from '@game/objects/characterBase/characterBase';
import type { ISkill } from '@game/skills/ISkill';
import { CommonSkill } from '@game/skills/commonSkill';
import { MMoveDirection } from '@modules/movement/player/MMoveDirection';
import { determineProjectileTrajectory } from '@utils/determineProjectileTrajectory';

export class Necro extends CharacterBase {
  public override firstSkill: ISkill;
  public override secondSkill: ISkill;
  /** Number of point orbs */

  private readonly _MMoveDirection: MMoveDirection;

  constructor() {
    super(NECROCONFIG.radius, NECROCONFIG.color.default);

    this._MMoveDirection = new MMoveDirection();

    this.firstSkill = new CommonSkill(this, {
      keyCode: 'KeyJ',
      onUse: this.firstSkillHandler.bind(this),
      condition: () => {
        if (this.isDead === true) return false;
        if (this.level.upgrades.firstSpell.current <= 0) return false;
        return true;
      },
      energyUsage: () => NECROCONFIG.firstSpell.energyUsage,
      cooldown: () => {
        const spellLevel = Math.max(0, this.level.upgrades.firstSpell.current - 1);
        return NECROCONFIG.firstSpell.cooldown[spellLevel];
      },
    });

    this.secondSkill = new CommonSkill(this, {
      keyCode: 'KeyK',
      onUse: this.secondSkillHandler.bind(this),
      condition: () => {
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
      energyUsage: () => NECROCONFIG.secondSpell.energyUsage,
      cooldown: () => {
        const spellLevel = Math.max(0, this.level.upgrades.secondSpell.current - 1);
        return NECROCONFIG.secondSpell.cooldown[spellLevel];
      },
    });
  }

  public override beforeUpdate(): void {
    super.beforeUpdate();
    this._MMoveDirection.beforeUpdate();
  }

  public override onUpdate(): void {
    super.onUpdate();
    console.log(this.level.atePointOrbs);
  }

  private firstSkillHandler(): void {
    const skillLevel = Math.max(0, this.level.upgrades.firstSpell.current - 1);

    NECROCONFIG.firstSpell.projectiles[skillLevel].forEach(velocityRatio => {
      const projectile = this.createFirstSkillProjectile(velocityRatio);
      projectile.init();
    });
  }

  private createFirstSkillProjectile(velocityRatio: {
    x: number;
    y: number;
  }): NecroFirstSpellProjectile {
    const velocity = determineProjectileTrajectory(
      this._MMoveDirection.moveDirection,
      velocityRatio,
      NECROCONFIG.firstSpell.projectileSpeed,
    );

    const projectile = new NecroFirstSpellProjectile({
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      radius: NECROCONFIG.firstSpell.projectileRadius,
      color: NECROCONFIG.firstSpell.projectileColor,
    });
    return projectile;
  }

  private secondSkillHandler(): void {
    this.revive();
  }
}
