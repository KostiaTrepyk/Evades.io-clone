import { CommonEnemy } from '@game/objects/enemies/CommonEnemy';
import type { Position } from '@shared-types/Position';
import { getRandomVelocity } from '@utils/other/getRandomVelocity';

export interface CreateCommonEnemyParams {
  radius: number;
  speed: number;
  position: Position;
}

export function createCommonEnemy(options: CreateCommonEnemyParams): CommonEnemy {
  return new CommonEnemy({
    position: options.position,
    radius: options.radius,
    velocity: getRandomVelocity(options.speed),
  });
}
