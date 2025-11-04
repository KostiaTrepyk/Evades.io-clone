import { PointOrb } from '@game/objects/pointOrb/PointOrb';
import type { Position } from '@shared-types/Position';

export function createPointOrb(position: Position): PointOrb {
  return new PointOrb(position);
}
