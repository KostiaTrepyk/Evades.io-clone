import { EnemyEnergyBurner } from '@game/objects/enemies/EnemyEnergyBurner';
import type { Position } from '@shared-types/Position';
import { getRandomVelocity } from '@utils/other/getRandomVelocity';

export function createEnemyEnergyBurner(speed: number, position: Position): EnemyEnergyBurner {
  return new EnemyEnergyBurner({
    position: position,
    velocity: getRandomVelocity(speed),
  });
}
