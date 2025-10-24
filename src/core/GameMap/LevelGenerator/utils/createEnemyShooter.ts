import { ENEMYSHOOTERCONFIG } from '../../../../configs/enemies/enemyShooter.config';
import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { EnemyShooter } from '../../../../objects/enemy/list/EnemyShooter/EnemyShooter';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { saveZoneWidth } from '../LevelGenerator';

export interface CreateEnemyShooterParams {
  speed: number;
  projectileSpeed: number;
  shootDistance: number;
}

export function createEnemyShooter(
  options: CreateEnemyShooterParams
): CommonEnemy {
  const halfSize = ENEMYSHOOTERCONFIG.size / 2;
  return new EnemyShooter({
    position: getRandomPosition({
      minX: saveZoneWidth + (halfSize + 2),
      maxX: renderer._canvasSize.x - saveZoneWidth - (halfSize + 2),
      minY: halfSize + 2,
      maxY: renderer._canvasSize.y - (halfSize + 2),
    }),
    velocity: getRandomVelocity(options.speed),
    projectileSpeed: options.projectileSpeed,
    shootDistance: options.shootDistance,
  });
}
