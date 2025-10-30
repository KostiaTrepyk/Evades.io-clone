import { PointOrb } from '../../../../objects/pointOrb/PointOrb';
import { Position } from '../../../types/Position';

export function createPointOrb(position: Position): PointOrb {
  return new PointOrb(position);
}
