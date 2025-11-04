import type { CommonEnemy } from '@game/objects/enemies/CommonEnemy';
import { EnemyShooter } from '@game/objects/enemies/EnemyShooter/EnemyShooter';
import type { Position } from '@shared-types/Position';
import { getRandomVelocity } from '@utils/other/getRandomVelocity';

export interface CreateEnemyShooterParams {
  position: Position;
  speed: number;
  projectileSpeed: number;
  shootDistance: number;
}

export function createEnemyShooter(options: CreateEnemyShooterParams): CommonEnemy {
  return new EnemyShooter({
    position: options.position,
    velocity: getRandomVelocity(options.speed),
    projectileSpeed: options.projectileSpeed,
    shootDistance: options.shootDistance,
  });
}
