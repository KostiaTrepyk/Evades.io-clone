import { EnemyBase } from '../enemyBase/enemyBase';

import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';

export interface CommonEnemyParams {
  position: Position;
  radius: number;
  velocity: Velocity;
}

export class CommonEnemy extends EnemyBase {
  constructor(params: CommonEnemyParams) {
    super(params);
  }
}
