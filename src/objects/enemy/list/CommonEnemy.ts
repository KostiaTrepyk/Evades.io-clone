import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Enemy } from '../enemy';
import { COMMONENEMYCONFIG } from '../../../configs/enemies/commonEnemy.config';

export class CommonEnemy extends Enemy {
  constructor(startPosition: Position, size: number, velocity: Velocity) {
    super(startPosition, size, velocity, COMMONENEMYCONFIG.color);
  }
}
