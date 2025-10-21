import { MORPHCONFIG } from '../../../configs/characters/morph.config';
import { MCollisionEnemy } from '../../../core/modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '../../../core/modules/collision/MCollisionWalls';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { HSLA } from '../../../core/utils/hsla';
import { Enemy } from '../../enemy/enemy';
import { Projectile } from '../../projectile/projectile';

export interface MorphFirstSkillProjectileParams {
  statusId: Symbol;
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphFirstSkillProjectile extends Projectile {
  private statusId: Symbol;

  private MCollisionEnemy: MCollisionEnemy;
  private MCollisionWalls: MCollisionWalls;

  constructor(params: MorphFirstSkillProjectileParams) {
    const { startPosition, size, velocity, color, statusId } = params;
    super({ startPosition, size, velocity, color });

    this.statusId = statusId;

    this.MCollisionEnemy = new MCollisionEnemy({
      object: this,
      onCollision: (enemy) => {
        this.collisionWithEnemy(enemy, this);
      },
    });

    this.MCollisionWalls = new MCollisionWalls({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: () => {
        this.delete();
      },
    });
  }

  public override afterUpdate(deltaTime: number): void {
    this.MCollisionEnemy.afterUpdate(deltaTime);
    this.MCollisionWalls.afterUpdate(deltaTime);
  }

  private collisionWithEnemy(enemy: Enemy, projectile: Projectile): void {
    const isApplied = enemy.EnemyStatus.MStatus.applyStatus({
      id: this.statusId,
      name: 'changeDirection',
      duration: MORPHCONFIG.firstSpell.duration,
    });

    // Если эффект не может быть применён.
    if (isApplied === false) return;

    // Изменяет направление полёта врага.
    const newVelocity = enemy.velocity;

    if (projectile.velocity.x > 0) newVelocity.x = Math.abs(enemy.velocity.x);
    else if (projectile.velocity.x < 0)
      newVelocity.x = -Math.abs(enemy.velocity.x);

    if (projectile.velocity.y > 0) newVelocity.y = Math.abs(enemy.velocity.y);
    else if (projectile.velocity.y < 0)
      newVelocity.y = -Math.abs(enemy.velocity.y);

    enemy.setVelocity = newVelocity;
  }
}
