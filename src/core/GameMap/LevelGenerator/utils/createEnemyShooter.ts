import { ENEMYSHOOTERCONFIG } from '../../../../configs/enemies/enemyShooter.config';
import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { EnemyShooter } from '../../../../objects/enemy/list/EnemyShooter/EnemyShooter';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { GenerateLevelConfiguration } from '../LevelGenerator';

export interface CreateEnemyShooterParams {
  speed: number;
  projectileSpeed: number;
  shootDistance: number;
  saveZones: GenerateLevelConfiguration['saveZones'];
}

export function createEnemyShooter(
  options: CreateEnemyShooterParams
): CommonEnemy {
  const halfSize = ENEMYSHOOTERCONFIG.size / 2;
  return new EnemyShooter({
    position: getRandomPosition({
      minX: options.saveZones.start.width + (halfSize + 2),
      maxX:
        renderer.canvasSize.x - options.saveZones.end.width - (halfSize + 2),
      minY: halfSize + 2,
      maxY: renderer.canvasSize.y - (halfSize + 2),
    }),
    velocity: getRandomVelocity(options.speed),
    projectileSpeed: options.projectileSpeed,
    shootDistance: options.shootDistance,
  });
}
