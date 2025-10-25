import { enemyEnergyBurnerSize } from '../../../../consts/enemies';
import { EnemyEnergyBurner } from '../../../../objects/enemy/list/EnemyEnergyBurner';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';
import { saveZoneWidth } from '../LevelGenerator';

export function createEnemyEnergyBurner(speed: number): EnemyEnergyBurner {
  return new EnemyEnergyBurner({
    position: getRandomPosition({
      minX: saveZoneWidth + (enemyEnergyBurnerSize + 2),
      maxX:
        renderer.canvasSize.x - saveZoneWidth - (enemyEnergyBurnerSize + 2),
      minY: enemyEnergyBurnerSize + 2,
      maxY: renderer.canvasSize.y - (enemyEnergyBurnerSize + 2),
    }),
    velocity: getRandomVelocity(speed),
  });
}
