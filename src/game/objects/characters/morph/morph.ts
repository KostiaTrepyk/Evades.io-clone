import { MorphFirstSkillProjectile } from './MorphFirstSkillProjectile';
import { MorphSecondSkillProjectile } from './MorphSecondSkillProjectile';

import { MORPHCONFIG } from '@config/characters/morph.config';
import { MMoveDirection } from '@core/modules/movement/player/MMoveDirection';
import { CharacterBase } from '@game/objects/characterBase/characterBase';
import { CommonSkill } from '@game/skills/commonSkill';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import type { MoveDirection } from '@shared-types/moveDirection';

const firstSkillId = Symbol('Morph change move direction');
const secondSkillSpeedId = Symbol('Morph size reduction');
const secondSkillSizeId = Symbol('Morph speed reduction');

export class Morph extends CharacterBase {
  override firstSkill: CommonSkill;
  override secondSkill: CommonSkill;

  private readonly MMoveDirection: MMoveDirection;

  constructor(startPosition: Position) {
    super(startPosition, MORPHCONFIG.radius, MORPHCONFIG.color.default.clone());

    this.MMoveDirection = new MMoveDirection();

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
    this.MMoveDirection.beforeUpdate();
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
    const velocity = this.computeProjectileVelocity(
      this.MMoveDirection.moveDirection,
      velocityRatio,
      MORPHCONFIG.firstSpell.projectileSpeed,
    );

    const projectile = new MorphFirstSkillProjectile({
      statusId: firstSkillId,
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      size: MORPHCONFIG.firstSpell.projectileRadius,
      color: MORPHCONFIG.firstSpell.projectileColor,
    });
    return projectile;
  }

  private createSecondSkillProjectile(velocityRatio: {
    x: number;
    y: number;
  }): MorphSecondSkillProjectile {
    const velocity = this.computeProjectileVelocity(
      this.MMoveDirection.moveDirection,
      velocityRatio,
      MORPHCONFIG.secondSpell.projectileSpeed,
    );

    const projectile = new MorphSecondSkillProjectile({
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      size: MORPHCONFIG.secondSpell.projectileRadius,
      color: MORPHCONFIG.secondSpell.projectileColor,
      statusIds: { speed: secondSkillSpeedId, size: secondSkillSizeId },
    });
    return projectile;
  }

  /* Это получается что мы берём два вектора: вектор направления игрока и его перпендикуляр вправо.
      1)  Вектор направления игрока умножаем на ratio.x   <- это движение вперёд
      2)  Перпендикуляр умножаем на ratio.y   <- это движение вправо
      3)  Складываем оба вектора и получаем x, y но полученный вектор не нормализован.
      4)  Считаем длину вектора.
      5)  Делим x, y на длину вектора (длина вектора должна быть равна 1 что-бы не искажать скорость. 
          Если будет равна например 2, тогда скорость будет в два раза выше).
      
      Ниже написано сокращенно.
  */
  /** Compute projectile velocity in world coords from local ratio */
  private computeProjectileVelocity(
    moveDirection: MoveDirection,
    ratio: { x: number; y: number },
    speed: number,
  ): Velocity {
    // right perpendicular
    const perp = { x: -moveDirection.y, y: moveDirection.x };

    // local -> world combination
    const worldX = moveDirection.x * ratio.x + perp.x * ratio.y;
    const worldY = moveDirection.y * ratio.x + perp.y * ratio.y;

    // normalize world direction to unit vector.
    const worldLen = Math.hypot(worldX, worldY) || 1;
    const nx = worldX / worldLen;
    const ny = worldY / worldLen;

    return { x: nx * speed, y: ny * speed };
  }
}
