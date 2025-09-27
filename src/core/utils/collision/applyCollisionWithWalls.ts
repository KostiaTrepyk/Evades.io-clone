import { GameObject } from '../../common/GameObject';
import { renderer } from '../../global';
import { Shape } from '../../types/Shape';

interface Collision {
  x: boolean;
  y: boolean;
}

export function applyCollisionWithWalls(
  gameObject: GameObject<Shape>,
  afterCollision?: (collision: Collision) => void
) {
  if (gameObject.objectModel.shape === 'circle') {
    const halfSize = gameObject.objectModel.size / 2;
    const position = gameObject.position;
    let collision: Collision = { x: true, y: true };

    if (position.x - halfSize < 0) position.x = halfSize;
    else if (position.x + halfSize > renderer.canvasSize.x)
      position.x = renderer.canvasSize.x - halfSize;
    else {
      collision.x = false;
    }

    if (position.y - halfSize < 0) position.y = halfSize;
    else if (position.y + halfSize > renderer.canvasSize.y)
      position.y = renderer.canvasSize.y - halfSize;
    else {
      collision.y = false;
    }

    if (afterCollision) afterCollision(collision);
    return;
  }

  if (gameObject.objectModel.shape === 'rectangle') {
    const halfSizeX = gameObject.objectModel.size.x / 2;
    const halfSizeY = gameObject.objectModel.size.y / 2;
    const position = gameObject.position;
    let collision: Collision = { x: true, y: true };

    if (position.x - halfSizeX < 0) position.x = halfSizeX;
    else if (position.x + halfSizeX > renderer.canvasSize.x)
      position.x = renderer.canvasSize.x - halfSizeX;
    else {
      collision.x = false;
    }

    if (position.y - halfSizeY < 0) position.y = halfSizeY;
    else if (position.y + halfSizeY > renderer.canvasSize.y)
      position.y = renderer.canvasSize.y - halfSizeY;
    else {
      collision.y = false;
    }

    if (afterCollision) afterCollision(collision);
    return;
  }
}
