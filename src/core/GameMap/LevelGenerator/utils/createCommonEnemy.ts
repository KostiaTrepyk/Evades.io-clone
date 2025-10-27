import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomSize } from '../../../utils/other/getRandomSize';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { GenerateLevelConfiguration } from '../LevelGenerator';

export interface CreateCommonEnemyParams {
  size: { min: number; max: number };
  speed: number;
  saveZones: GenerateLevelConfiguration['saveZones'];
}

export function createCommonEnemy(
  options: CreateCommonEnemyParams
): CommonEnemy {
  const size = getRandomSize(options.size.min, options.size.max);
  const halfSize = size / 2;

  return new CommonEnemy({
    position: getRandomPosition({
      minX: options.saveZones.start.width + (halfSize + 2),
      maxX:
        renderer.canvasSize.x - options.saveZones.end.width - (halfSize + 2),
      minY: halfSize + 2,
      maxY: renderer.canvasSize.y - (halfSize + 2),
    }),
    size,
    velocity: getRandomVelocity(options.speed),
  });
}
