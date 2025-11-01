import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { EnemyShooter } from '../../../../objects/enemy/list/EnemyShooter/EnemyShooter';
import { Position } from '../../../types/Position';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';

export interface CreateEnemyShooterParams {
  position: Position;
  speed: number;
  projectileSpeed: number;
  shootDistance: number;
}

export function createEnemyShooter(
  options: CreateEnemyShooterParams
): CommonEnemy {
  return new EnemyShooter({
    position: options.position,
    velocity: getRandomVelocity(options.speed),
    projectileSpeed: options.projectileSpeed,
    shootDistance: options.shootDistance,
  });
}
