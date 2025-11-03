import { Boundary } from '../../types/Boundary';
import { Shape } from '../../types/Shape';
import { CircleObject } from './CircleObject';
import { RectangleObject } from './RectangleObject';

export class GameObjectUtils {
  public static getBoundary(object: RectangleObject): Boundary<'rectangle'>;
  public static getBoundary(object: CircleObject): Boundary<'circle'>;
  public static getBoundary(
    object: RectangleObject | CircleObject
  ): Boundary<Shape> {
    if (object.shape === 'rectangle') {
      // Rectangle
      const halfSizeX = object.size.width / 2;
      const halfSizeY = object.size.height / 2;

      const from = {
        x: object.position.x - halfSizeX,
        y: object.position.y - halfSizeY,
      };

      const to = {
        x: object.position.x + halfSizeX,
        y: object.position.y + halfSizeY,
      };

      return { shape: 'rectangle', from, to } as Boundary<'rectangle'>;
    }

    return {
      shape: 'circle',
      position: object.position,
      radius: object.radius,
    } as Boundary<'circle'>;
  }
}
