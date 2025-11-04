import { EnemyBase } from '../enemyBase/enemyBase';

import { ENEMYBORDERCONFIG } from '@config/enemies/enemyBorder.config';
import { MEnemyMovementBorder } from '@core/modules/movement/enemy/MEnemyMovementBorder';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';

export interface EnemyBorderParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyBorder extends EnemyBase {
  protected override EnemyMovement: MEnemyMovementBorder;

  constructor(params: EnemyBorderParams) {
    super({
      position: params.position,
      velocity: params.velocity,
      radius: ENEMYBORDERCONFIG.radius,
      color: ENEMYBORDERCONFIG.color,
    });

    this.EnemyMovement = new MEnemyMovementBorder(this);

    // Disables application of all statuses.
    this.EnemyStatus.MStatus.disable();
  }
}
