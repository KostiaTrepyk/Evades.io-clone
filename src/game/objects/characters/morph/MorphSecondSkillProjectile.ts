import { MORPHCONFIG } from '@config/objects/characters/morph.config';
import type { EnemyBase } from '@game/objects/enemyBase/enemyBase';
import { Projectile } from '@game/objects/projectile/projectile';
import { MCollisionEnemy } from '@modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '@modules/collision/MCollisionWalls';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import type { HSLA } from '@utils/hsla';

export interface MorphSecondSkillProjectileParams {
  statusIds: { speed: Symbol; size: Symbol };
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphSecondSkillProjectile extends Projectile {
  private readonly statusIds: { speed: Symbol; size: Symbol };

  private readonly MCollisionEnemy: MCollisionEnemy;
  private readonly MCollisionWalls: MCollisionWalls;

  constructor(params: MorphSecondSkillProjectileParams) {
    const { startPosition, size, velocity, color, statusIds } = params;
    super({ startPosition, radius: size, velocity, color });

    this.statusIds = statusIds;

    this.MCollisionEnemy = new MCollisionEnemy({
      object: this,
      onCollision: enemy => {
        this.collisionWithEnemy(enemy);
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

  private collisionWithEnemy(enemy: EnemyBase): void {
    const enemyHalfSpeed = (Math.abs(enemy.velocity.x) + Math.abs(enemy.velocity.y)) / 2;

    enemy.EnemyStatus.MStatus.applyStatus({
      id: this.statusIds.size,
      name: 'sizeReduction',
      effects: { sizeScale: -0.5 },
      duration: MORPHCONFIG.secondSpell.duration,
    });
    enemy.EnemyStatus.MStatus.applyStatus({
      id: this.statusIds.speed,
      name: 'speedReduction',
      effects: { speed: -enemyHalfSpeed },
      duration: MORPHCONFIG.secondSpell.duration,
    });
  }
}
