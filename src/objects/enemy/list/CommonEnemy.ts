import { HSLA } from '../../../core/utils/hsla';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Enemy } from '../enemy';

export class CommonEnemy extends Enemy {
  constructor(startPosition: Position, size: number, velocity: Velocity) {
    super(startPosition, size, velocity);
    this.color = new HSLA(0, 0, 60, 1);
  }
}
