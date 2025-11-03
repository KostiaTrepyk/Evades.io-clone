import { RectangleBoundary } from '../../types/Boundary';
import { RectangleObject } from './RectangleObject';

export class RectangleObjectUtils {
  public static getBoundary(object: RectangleObject): RectangleBoundary {
    const halfSizeX = object.size.width / 2;
    const halfSizeY = object.size.height / 2;

    const from = {
      x: object.position.x - halfSizeX,
      y: object.position.y - halfSizeY,
    } satisfies RectangleBoundary['from'];

    const to = {
      x: object.position.x + halfSizeX,
      y: object.position.y + halfSizeY,
    } satisfies RectangleBoundary['to'];

    return { shape: 'rectangle', from, to };
  }
}
