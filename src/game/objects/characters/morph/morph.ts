import { MorphFirstSkillProjectile } from './MorphFirstSkillProjectile';
import { MorphSecondSkillProjectile } from './MorphSecondSkillProjectile';

import { MORPHCONFIG } from '@config/objects/characters/morph.config';
import { CharacterBase } from '@game/objects/characterBase/characterBase';
import { CommonSkill } from '@game/skills/commonSkill';
import { MMoveDirection } from '@modules/movement/player/MMoveDirection';
import { determineProjectileTrajectory } from '@utils/determineProjectileTrajectory';

const firstSkillId = Symbol('Morph change move direction');
const secondSkillSpeedId = Symbol('Morph size reduction');
const secondSkillSizeId = Symbol('Morph speed reduction');

export class Morph extends CharacterBase {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;

  private readonly _MMoveDirection: MMoveDirection;

  constructor() {
    super(MORPHCONFIG.radius, MORPHCONFIG.color.default.clone());

    this._MMoveDirection = new MMoveDirection();

    this.firstSkill = new CommonSkill(this, {
      keyCode: 'KeyJ',
      onUse: this.firstSkillHandler.bind(this),
      energyUsage: () => MORPHCONFIG.firstSpell.energyUsage,
      cooldown: () =>
        MORPHCONFIG.firstSpell.cooldown[Math.max(0, this.level.upgrades.firstSpell.current - 1)],
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.firstSpell.current <= 0) return false;
        return true;
      },
    });

    this.secondSkill = new CommonSkill(this, {
      keyCode: 'KeyK',
      onUse: this.secondSkillHandler.bind(this),
      energyUsage: () => MORPHCONFIG.secondSpell.energyUsage,
      cooldown: () =>
        MORPHCONFIG.secondSpell.cooldown[Math.max(0, this.level.upgrades.secondSpell.current - 1)],
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
    });
  }

  public override beforeUpdate(): void {
    super.beforeUpdate();
    this._MMoveDirection.beforeUpdate();
  }

  private firstSkillHandler(): void {
    const skillLevel = Math.max(0, this.level.upgrades.firstSpell.current - 1);

    MORPHCONFIG.firstSpell.projectiles[skillLevel].forEach(velocityRatio => {
      const projectile = this.createFirstSkillProjectile(velocityRatio);
      projectile.init();
    });
  }

  private secondSkillHandler(): void {
    const skillLevel = Math.max(0, this.level.upgrades.secondSpell.current - 1);

    MORPHCONFIG.secondSpell.projectiles[skillLevel].forEach(velocityRatio => {
      const projectile = this.createSecondSkillProjectile(velocityRatio);
      projectile.init();
    });
  }

  private createFirstSkillProjectile(velocityRatio: {
    x: number;
    y: number;
  }): MorphFirstSkillProjectile {
    const velocity = determineProjectileTrajectory(
      this._MMoveDirection.moveDirection,
      velocityRatio,
      MORPHCONFIG.firstSpell.projectileSpeed,
    );

    const projectile = new MorphFirstSkillProjectile({
      statusId: firstSkillId,
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      radius: MORPHCONFIG.firstSpell.projectileRadius,
      color: MORPHCONFIG.firstSpell.projectileColor,
    });
    return projectile;
  }

  private createSecondSkillProjectile(velocityRatio: {
    x: number;
    y: number;
  }): MorphSecondSkillProjectile {
    const velocity = determineProjectileTrajectory(
      this._MMoveDirection.moveDirection,
      velocityRatio,
      MORPHCONFIG.secondSpell.projectileSpeed,
    );

    const projectile = new MorphSecondSkillProjectile({
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      radius: MORPHCONFIG.secondSpell.projectileRadius,
      color: MORPHCONFIG.secondSpell.projectileColor,
      statusIds: { speed: secondSkillSpeedId, size: secondSkillSizeId },
    });
    return projectile;
  }
}
