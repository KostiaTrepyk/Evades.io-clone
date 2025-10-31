import { CircleShape, RectangleShape, Shape } from '../../types/Shape';
import { GameObject } from './GameObject';

export class GameObjectUtils {
  public static getBoundaryRect(object: GameObject<Shape>):
    | {
        shape: RectangleShape;
        from: { x: number; y: number };
        to: { x: number; y: number };
      }
    | {
        shape: CircleShape;
        radius: number;
      } {
    if (object.objectModel.shape === 'rectangle') {
      // Rect
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

      return { shape: 'rectangle', from, to };
    }

    // Circle
    return { shape: 'circle', radius: object.objectModel.radius };
  }
}
