import { MORPHCONFIG } from '../../../configs/characters/morph.config';
import { time } from '../../../core/global';
import { MMoveDirection } from '../../../core/modules/movement/MMoveDirection';
import { MoveDirection } from '../../../core/types/moveDirection';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonSkill';
import { Enemy } from '../../enemy/enemy';
import { MorphFirstSkillProjectile } from './MorphFirstSkillProjectile';
import { MorphSecondSkillProjectile } from './MorphSecondSkillProjectile';

/** In seconds */
const firstSkillEffectCooldown = 1;
/** In seconds */
const secondSkillEffectCooldown = 2;

const firstSkillId = Symbol('Morph change move direction');
const secondSkillSpeedId = Symbol('Morph size reduction');
const secondSkillSizeId = Symbol('Morph speed reduction');

export class Morph extends Character {
  override firstSkill: CommonSkill;
  override secondSkill: CommonSkill;

  private MMoveDirection: MMoveDirection;

  public enemyEffectedByFirstSkill: { enemy: Enemy; timestamp: number }[];
  public enemyEffectedBySecondSkill: { enemy: Enemy; timestamp: number }[];

  constructor(startPosition: Position) {
    super(startPosition, MORPHCONFIG.size, MORPHCONFIG.color.default.clone());

    this.MMoveDirection = new MMoveDirection();
    this.enemyEffectedByFirstSkill = [];
    this.enemyEffectedBySecondSkill = [];

    this.firstSkill = new CommonSkill(this, {
      keyCode: 'KeyJ',
      onUse: this.firstSkillHandler.bind(this),
      energyUsage: () => MORPHCONFIG.firstSpell.energyUsage,
      cooldown: () =>
        MORPHCONFIG.firstSpell.cooldown[
          this.level.upgrades.firstSpell.current - 1
        ],
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
        MORPHCONFIG.secondSpell.cooldown[
          this.level.upgrades.secondSpell.current - 1
        ],
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this.MMoveDirection.onUpdate();

    // Позволяет наносить эффект не чаще чем раз в несколько секунд.
    this.enemyEffectedByFirstSkill = this.enemyEffectedByFirstSkill.filter(
      ({ enemy, timestamp }) => {
        const shouldBeCleared =
          timestamp + firstSkillEffectCooldown * 1000 > time.timestamp;
        if (!shouldBeCleared) {
          enemy.currentColor = enemy.defaultColor.clone();
          enemy.EnemyStatus.MStatus.removeStatus(firstSkillId);
        }
        return shouldBeCleared;
      }
    );

    // Позволяет наносить эффект не чаще чем раз в несколько секунд.
    this.enemyEffectedBySecondSkill = this.enemyEffectedBySecondSkill.filter(
      ({ enemy, timestamp }) => {
        const shouldBeCleared =
          timestamp + secondSkillEffectCooldown * 1000 > time.timestamp;
        if (!shouldBeCleared) {
          enemy.currentColor = enemy.defaultColor.clone();
          enemy.EnemyStatus.MStatus.removeStatus(secondSkillSpeedId);
          enemy.EnemyStatus.MStatus.removeStatus(secondSkillSizeId);
        }
        return shouldBeCleared;
      }
    );
  }

  private firstSkillHandler(): void {
    const skillLevel = Math.max(0, this.level.upgrades.firstSpell.current - 1);

    MORPHCONFIG.firstSpell.projectiles[skillLevel].forEach((velocityRatio) => {
      const projectile = this.createFirstSkillProjectile(velocityRatio);
      projectile.create();
    });
  }

  private secondSkillHandler(): void {
    const skillLevel = Math.max(0, this.level.upgrades.secondSpell.current - 1);

    MORPHCONFIG.secondSpell.projectiles[skillLevel].forEach((velocityRatio) => {
      const projectile = this.createSecondSkillProjectile(velocityRatio);
      projectile.create();
    });
  }

  private createFirstSkillProjectile(velocityRatio: {
    x: number;
    y: number;
  }): MorphFirstSkillProjectile {
    const velocity = this.computeProjectileVelocity(
      this.MMoveDirection.moveDirection,
      velocityRatio,
      MORPHCONFIG.firstSpell.projectileSpeed
    );

    const projectile = new MorphFirstSkillProjectile({
      statusId: firstSkillId,
      player: this,
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      size: MORPHCONFIG.firstSpell.projectileSize,
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
      MORPHCONFIG.secondSpell.projectileSpeed
    );

    const projectile = new MorphSecondSkillProjectile({
      player: this,
      startPosition: { x: this.position.x, y: this.position.y },
      velocity: { x: velocity.x, y: velocity.y },
      size: MORPHCONFIG.secondSpell.projectileSize,
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
    speed: number
  ): Velocity {
    // right perpendicular
    const perp = { x: -moveDirection.y, y: moveDirection.x };

    // local -> world combination
    let worldX = moveDirection.x * ratio.x + perp.x * ratio.y;
    let worldY = moveDirection.y * ratio.x + perp.y * ratio.y;

    // normalize world direction to unit vector.
    const worldLen = Math.hypot(worldX, worldY) || 1;
    const nx = worldX / worldLen;
    const ny = worldY / worldLen;

    return { x: nx * speed, y: ny * speed };
  }
}
