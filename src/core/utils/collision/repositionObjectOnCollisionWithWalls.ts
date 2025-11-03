import { CircleObject } from '../../common/CircleObject/CircleObject';
import { RectangleObject } from '../../common/RectangleObject/RectangleObject';
import { renderer } from '../../global';
import { Collision } from '../../types/Collision';

/** Мутирует object */
export function repositionObjectOnCollisionWithWalls(
  object: RectangleObject | CircleObject,
  collision: Collision
): void {
  // applyCollision for circle
  if (object.shape === 'circle') {
    const halfSize = object.radius;

    if (collision.x === 'left') object.position.x = halfSize;
    else if (collision.x === 'right')
      object.position.x = renderer.canvasSize.x - halfSize;
    if (collision.y === 'top') object.position.y = halfSize;
    else if (collision.y === 'bottom')
      object.position.y = renderer.canvasSize.y - halfSize;
  }

  // applyCollision for rectangle
  if (object.shape === 'rectangle') {
    const halfSizeX = object.size.width / 2;
    const halfSizeY = object.size.height / 2;

    if (collision.x === 'left') object.position.x = halfSizeX;
    else if (collision.x === 'right')
      object.position.x = renderer.canvasSize.x - halfSizeX;
    if (collision.y === 'top') object.position.y = halfSizeY;
    else if (collision.y === 'bottom')
      object.position.y = renderer.canvasSize.y - halfSizeY;
  }
}
