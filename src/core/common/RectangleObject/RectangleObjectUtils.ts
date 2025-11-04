import type { RectangleObject } from './RectangleObject';

import type { RectangleBoundary } from '@shared-types/Boundary';

export class RectangleObjectUtils {
  /*   public static getBoundaries(object: RectangleObject): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
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
  } */

  public static getOccupiedArea(object: RectangleObject): RectangleBoundary {
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
