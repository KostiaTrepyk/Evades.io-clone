import { GameObject } from '../../common/GameObject';
import { renderer } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';

export function doWallIntersect(gameObject: GameObject<Shape>): Collision {
  if (gameObject.objectModel.shape === 'circle') {
    const halfSize = gameObject.objectModel.size / 2;
    const position = gameObject.position;
    let collision: Collision = { x: true, y: true };

    if (position.x - halfSize < 0) collision.x = true;
    else if (position.x + halfSize > renderer.canvasSize.x) collision.x = true;
    else collision.x = false;

    if (position.y - halfSize < 0) collision.y = true;
    else if (position.y + halfSize > renderer.canvasSize.y) collision.y = true;
    else collision.y = false;

    return collision;
  }

  if (gameObject.objectModel.shape === 'rectangle') {
    const halfSizeX = gameObject.objectModel.size.x / 2;
    const halfSizeY = gameObject.objectModel.size.y / 2;
    const position = gameObject.position;
    let collision: Collision = { x: true, y: true };

    if (position.x - halfSizeX < 0) collision.x = true;
    else if (position.x + halfSizeX > renderer.canvasSize.x) collision.x = true;
    else {
      collision.x = false;
    }

    if (position.y - halfSizeY < 0) collision.y = true;
    else if (position.y + halfSizeY > renderer.canvasSize.y) collision.y = true;
    else collision.y = false;

    return collision;
  }

  throw new Error('Unknown shape!');
}
