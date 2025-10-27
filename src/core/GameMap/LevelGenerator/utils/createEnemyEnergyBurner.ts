import { enemyEnergyBurnerSize } from '../../../../consts/enemies';
import { EnemyEnergyBurner } from '../../../../objects/enemy/list/EnemyEnergyBurner';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { GenerateLevelConfiguration } from '../LevelGenerator';

/* FIX ME Позицию неправильно считает. */
export function createEnemyEnergyBurner(
  speed: number,
  saveZones: GenerateLevelConfiguration['saveZones']
): EnemyEnergyBurner {
  return new EnemyEnergyBurner({
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
