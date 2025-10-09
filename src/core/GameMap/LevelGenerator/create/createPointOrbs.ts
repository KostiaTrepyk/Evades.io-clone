import { PointOrb } from '../../../../objects/pointOrb/PointOrb';
import { renderer } from '../../../global';
import { saveZoneWidth } from '../LevelGenerator';
import { getRandomPosition } from '../helpers/helpers';

export function createPointOrbs(count: number): void {
  Array.from({ length: count }).forEach(() => {
    const pointOrb = new PointOrb(
      getRandomPosition({
        minX: saveZoneWidth + 50,
        maxX: renderer._canvasSize.x - saveZoneWidth - 50,
        minY: 50,
        maxY: renderer._canvasSize.y - 50,
      })
    );
    pointOrb.create();
  });
}
