import { CommonEnemy } from '../../../../objects/enemy/list/CommonEnemy';
import { renderer } from '../../../global';
import { saveZoneWidth } from '../LevelGenerator';
import {
  getRandomPosition,
  getRandomSize,
  getRandomVelocity,
} from '../helpers/helpers';
import { CommonEnemyOptions } from '../types';

export function createCommonEnemy(options: CommonEnemyOptions): void {
  const newCommonEnemy = new CommonEnemy(
    getRandomPosition({
      minX: saveZoneWidth + (options.size.max / 2 + 2),
      maxX: renderer._canvasSize.x - saveZoneWidth - (options.size.max / 2 + 2),
      minY: options.size.max / 2 + 2,
      maxY: renderer._canvasSize.y - (options.size.max / 2 + 2),
    }),
    getRandomSize(options.size.min, options.size.max),
    getRandomVelocity(options.speed)
  );
  newCommonEnemy.create();
}
