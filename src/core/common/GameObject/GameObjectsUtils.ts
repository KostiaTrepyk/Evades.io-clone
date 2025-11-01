import { Boundary } from '../../types/Boundary';
import { Shape } from '../../types/Shape';
import { GameObject } from './GameObject';

export class GameObjectUtils {
  public static getBoundary(
    object: GameObject<'rectangle'>
  ): Boundary<'rectangle'>;
  public static getBoundary(object: GameObject<'circle'>): Boundary<'circle'>;
  public static getBoundary(object: GameObject<Shape>): Boundary<Shape> {
    if (object.objectModel.shape === 'rectangle') {
      // Rectangle
      const halfSizeX = object.objectModel.size.x / 2;
      const halfSizeY = object.objectModel.size.y / 2;

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
      radius: object.objectModel.radius,
    } as Boundary<'circle'>;
  }
}
