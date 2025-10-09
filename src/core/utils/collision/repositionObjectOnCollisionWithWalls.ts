import { GameObject } from '../../common/GameObject';
import { renderer } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';

/** Мутирует object */
export function repositionObjectOnCollisionWithWalls(
  object: GameObject<Shape>,
  collision: Collision
): void {
  // applyCollision for circle
  if (object.objectModel.shape === 'circle') {
    const halfSize = object.objectModel.size / 2;

    if (collision.x === 'left') object.position.x = halfSize;
    else if (collision.x === 'right')
      object.position.x = renderer._canvasSize.x - halfSize;
    if (collision.y === 'top') object.position.y = halfSize;
    else if (collision.y === 'bottom')
      object.position.y = renderer._canvasSize.y - halfSize;
  }

  // applyCollision for rectangle
  if (object.objectModel.shape === 'rectangle') {
    const halfSizeX = object.objectModel.size.x / 2;
    const halfSizeY = object.objectModel.size.y / 2;

    if (collision.x === 'left') object.position.x = halfSizeX;
    else if (collision.x === 'right')
      object.position.x = renderer._canvasSize.x - halfSizeX;
    if (collision.y === 'top') object.position.y = halfSizeY;
    else if (collision.y === 'bottom')
      object.position.y = renderer._canvasSize.y - halfSizeY;
  }
}
