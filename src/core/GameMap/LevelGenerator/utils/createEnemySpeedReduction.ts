import { EnemySpeedReduction } from '@game/objects/enemies/EnemySpeedReduction';
import type { Position } from '@shared-types/Position';
import { getRandomVelocity } from '@utils/other/getRandomVelocity';

export function createEnemySpeedReduction(speed: number, position: Position): EnemySpeedReduction {
  return new EnemySpeedReduction({
    position: position,
    velocity: getRandomVelocity(speed),
  });
}
