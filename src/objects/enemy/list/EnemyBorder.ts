import { ENEMYBORDERCONFIG } from '../../../configs/enemies/enemyBorder.config';
import { MEnemyMoveBorder } from '../../../core/modules/movement/enemy/MEnemyMoveBorder';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Enemy } from '../enemy';

export interface EnemyBorderParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyBorder extends Enemy {
  protected override EnemyMovement: MEnemyMoveBorder;

  constructor(params: EnemyBorderParams) {
    super({
      position: params.position,
      velocity: params.velocity,
      size: ENEMYBORDERCONFIG.size,
      color: ENEMYBORDERCONFIG.color,
    });

    this.EnemyMovement = new MEnemyMoveBorder(this);

    // Disables application of all statuses.
    this.EnemyStatus.MStatus.disable();
  }
}
