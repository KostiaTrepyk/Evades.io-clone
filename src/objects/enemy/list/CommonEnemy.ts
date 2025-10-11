import { COMMONENEMYCONFIG } from '../../../configs/enemies/commonEnemy.config';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Enemy } from '../enemy';

export interface CommonEnemyParams {
  position: Position;
  size: number;
  velocity: Velocity;
}

export class CommonEnemy extends Enemy {
  constructor(params: CommonEnemyParams) {
    super({ ...params, color: { hue: COMMONENEMYCONFIG.color.hue } });
  }
}
