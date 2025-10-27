import { enemyEnergyBurnerSize } from '../../../../consts/enemies';
import { EnemySpeedReduction } from '../../../../objects/enemy/list/EnemySpeedReduction';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { GenerateLevelConfiguration } from '../LevelGenerator';

export function createEnemySpeedReduction(
  speed: number,
  saveZones: GenerateLevelConfiguration['saveZones']
): EnemySpeedReduction {
  return new EnemySpeedReduction({
    position: getRandomPosition({
      minX: saveZones.start.width + (enemyEnergyBurnerSize + 2),
      maxX:
        renderer.canvasSize.x -
        saveZones.end.width -
        (enemyEnergyBurnerSize + 2),
      minY: enemyEnergyBurnerSize + 2,
      maxY: renderer.canvasSize.y - (enemyEnergyBurnerSize + 2),
    }),
    velocity: getRandomVelocity(speed),
  });
}
