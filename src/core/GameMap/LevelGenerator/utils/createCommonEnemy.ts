import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomSize } from '../../../utils/other/getRandomSize';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { CommonEnemyConfiguration } from '../../types';
import { saveZoneWidth } from '../LevelGenerator';

export interface CreateCommonEnemyParams {
  size: { min: number; max: number };
  speed: number;
}

export function createCommonEnemy(
  options: CreateCommonEnemyParams
): CommonEnemy {
  return new CommonEnemy({
    position: getRandomPosition({
      minX: saveZoneWidth + (options.size.max / 2 + 2),
      maxX: renderer._canvasSize.x - saveZoneWidth - (options.size.max / 2 + 2),
      minY: options.size.max / 2 + 2,
      maxY: renderer._canvasSize.y - (options.size.max / 2 + 2),
    }),
    size: getRandomSize(options.size.min, options.size.max),
    velocity: getRandomVelocity(options.speed),
  });
}
