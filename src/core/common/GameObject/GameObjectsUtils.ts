import { Boundary } from '../../types/Boundary';
import { Shape } from '../../types/Shape';
import { GameObject } from './GameObject';

export class GameObjectUtils {
  /** Возвращает какие клетки занимает объект на карте */
  public static getBoundary(object: GameObject<Shape>): Boundary {
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

      return { from, to };
    }

    // Circle FIX ME - немного неправильно работает, зато быстро.
    const radius = object.objectModel.radius;

    const from = {
      x: object.position.x - radius,
      y: object.position.y - radius,
    };
    const to = {
      x: object.position.x + radius,
      y: object.position.y + radius,
    };

    return { from, to };
  }
}
