import { MORPHCONFIG } from '@config/objects/characters/morph.config';
import type { EnemyBase } from '@game/objects/enemyBase/enemyBase';
import { Projectile } from '@game/objects/projectile/projectile';
import { MCollisionEnemy } from '@modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '@modules/collision/MCollisionWalls';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import type { HSLA } from '@utils/hsla';

export interface MorphFirstSkillProjectileParams {
  statusId: Symbol;
  startPosition: Position;
  radius: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphFirstSkillProjectile extends Projectile {
  private readonly statusId: Symbol;

  private readonly MCollisionEnemy: MCollisionEnemy;
  private readonly MCollisionWalls: MCollisionWalls;

  constructor(params: MorphFirstSkillProjectileParams) {
    const { startPosition, radius, velocity, color, statusId } = params;
    super({ startPosition, radius, velocity, color });

    this.statusId = statusId;

    this.MCollisionEnemy = new MCollisionEnemy({
      object: this,
      onCollision: enemy => {
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

  public override afterUpdate(): void {
    this.MCollisionEnemy.afterUpdate();
    this.MCollisionWalls.afterUpdate();
  }

  private collisionWithEnemy(enemy: EnemyBase, projectile: Projectile): void {
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
    else if (projectile.velocity.x < 0) newVelocity.x = -Math.abs(enemy.velocity.x);

    if (projectile.velocity.y > 0) newVelocity.y = Math.abs(enemy.velocity.y);
    else if (projectile.velocity.y < 0) newVelocity.y = -Math.abs(enemy.velocity.y);

    enemy.setVelocity = newVelocity;
  }
}
