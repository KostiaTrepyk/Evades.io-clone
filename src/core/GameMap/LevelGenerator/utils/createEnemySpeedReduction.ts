import { EnemySpeedReduction } from '../../../../objects/enemy/list/EnemySpeedReduction';
import { Position } from '../../../types/Position';
import { getRandomVelocity } from '../../../utils/other/getRandomVelocity';

export function createEnemySpeedReduction(
  speed: number,
  position: Position
): EnemySpeedReduction {
  return new EnemySpeedReduction({
    position: position,
    velocity: getRandomVelocity(speed),
  });
}
