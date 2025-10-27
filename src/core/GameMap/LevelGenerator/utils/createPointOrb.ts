import { POINTORBCONFIG } from '../../../../configs/pointOrb.config';
import { PointOrb } from '../../../../objects/pointOrb/PointOrb';
import { renderer } from '../../../global';
import { getRandomPosition } from '../../../utils/other/getRandomPosition';
import { GenerateLevelConfiguration } from '../LevelGenerator';

export function createPointOrb(
  saveZones: GenerateLevelConfiguration['saveZones']
): PointOrb {
  const halfSize = POINTORBCONFIG.size / 2;

  return new PointOrb(
    getRandomPosition({
      minX: saveZones.start.width + halfSize,
      maxX: renderer.canvasSize.x - saveZones.end.width - halfSize,
      minY: halfSize,
      maxY: renderer.canvasSize.y - halfSize,
    })
  );
}
