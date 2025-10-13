import { enemyEnergyBurnerSize } from '../../../../consts/enemies';
import { EnemySpeedReduction } from '../../../../objects/enemy/list/EnemySpeedReduction';

import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { saveZoneWidth } from '../LevelGenerator';

export function createEnemySpeedReduction(speed: number): EnemySpeedReduction {
  return new EnemySpeedReduction({
    position: getRandomPosition({
      minX: saveZoneWidth + (enemyEnergyBurnerSize + 2),
      maxX:
        renderer._canvasSize.x - saveZoneWidth - (enemyEnergyBurnerSize + 2),
      minY: enemyEnergyBurnerSize + 2,
      maxY: renderer._canvasSize.y - (enemyEnergyBurnerSize + 2),
    }),
    velocity: getRandomVelocity(speed),
  });
}
