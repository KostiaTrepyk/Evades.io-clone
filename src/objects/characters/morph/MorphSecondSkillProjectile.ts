import { time } from '../../../core/global';
import { MCollisionEnemy } from '../../../core/modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '../../../core/modules/collision/MCollisionWalls';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { HSLA } from '../../../core/utils/hsla';
import { Enemy } from '../../enemy/enemy';
import { Projectile } from '../../projectile/projectile';
import { Morph } from './morph';

export interface MorphSecondSkillProjectileParams {
  statusIds: { speed: Symbol; size: Symbol };
  player: Morph;
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphSecondSkillProjectile extends Projectile {
  private player: Morph;
  private statusIds: { speed: Symbol; size: Symbol };

  private MCollisionEnemy: MCollisionEnemy;
  private MCollisionWalls: MCollisionWalls;

  constructor(params: MorphSecondSkillProjectileParams) {
    const { player, startPosition, size, velocity, color, statusIds } = params;
    super({ startPosition, size, velocity, color });

    this.statusIds = statusIds;

    this.player = player;
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
    // Skip if enemy has disabled statuses.
    if (enemy.isStatusesDisabled === true) return;

    const affectedEnemy = this.player.enemyEffectedBySecondSkill.find(
      ({ enemy: effectedEnemy }) => effectedEnemy === enemy
    );

    // Если существует то обновляем время, если нет тогда делаем push
    if (affectedEnemy !== undefined) {
      affectedEnemy.timestamp = time.timestamp;
    } else {
      this.player.enemyEffectedBySecondSkill.push({
        timestamp: time.timestamp,
        enemy,
      });
    }

    const enemyHalfSpeed =
      (Math.abs(enemy.velocity.x) + Math.abs(enemy.velocity.y)) / 2;

    enemy.EnemyStatus.MStatus.applyStatus({
      id: this.statusIds.size,
      name: 'sizeReduction',
      effects: { sizeScale: -0.5 },
    });
    enemy.EnemyStatus.MStatus.applyStatus({
      id: this.statusIds.speed,
      name: 'speedReduction',
      effects: { speed: -enemyHalfSpeed },
    });
  }
}
