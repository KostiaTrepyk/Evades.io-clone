import { MORPHCONFIG } from '../../../configs/characters/morph.config';
import { MCollisionEnemy } from '../../../core/modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '../../../core/modules/collision/MCollisionWalls';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { HSLA } from '../../../core/utils/hsla';
import { Enemy } from '../../enemy/enemy';
import { Projectile } from '../../projectile/projectile';

export interface MorphSecondSkillProjectileParams {
  statusIds: { speed: Symbol; size: Symbol };
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphSecondSkillProjectile extends Projectile {
  private statusIds: { speed: Symbol; size: Symbol };

  private MCollisionEnemy: MCollisionEnemy;
  private MCollisionWalls: MCollisionWalls;

  constructor(params: MorphSecondSkillProjectileParams) {
    const { startPosition, size, velocity, color, statusIds } = params;
    super({ startPosition, radius: size, velocity, color });

    this.statusIds = statusIds;

    this.MCollisionEnemy = new MCollisionEnemy({
      object: this,
      onCollision: (enemy) => {
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

  private collisionWithEnemy(enemy: Enemy): void {
    const enemyHalfSpeed =
      (Math.abs(enemy.velocity.x) + Math.abs(enemy.velocity.y)) / 2;

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
