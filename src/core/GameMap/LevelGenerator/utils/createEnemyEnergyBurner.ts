import { EnemyEnergyBurner } from '../../../../objects/enemy/list/EnemyEnergyBurner';
import { Position } from '../../../types/Position';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';

export function createEnemyEnergyBurner(
  speed: number,
  position: Position
): EnemyEnergyBurner {
  return new EnemyEnergyBurner({
    position: position,
    velocity: getRandomVelocity(speed),
  });
}
