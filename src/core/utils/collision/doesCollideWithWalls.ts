import { GameObject } from '../../common/GameObject/GameObject';
import { renderer } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';

interface DoesCollideWithWallsReturn {
  doesCollide: boolean;
  collisions: {
    x: 'left' | 'right' | 'no';
    y: 'top' | 'bottom' | 'no';
  };
}

export function doesCollideWithWalls(
  gameObject: GameObject<Shape>
): DoesCollideWithWallsReturn {
  if (gameObject.objectModel.shape === 'circle') {
    const radius = gameObject.objectModel.radius;
    const position = gameObject.position;
    let collisions: Collision = { x: 'no', y: 'no' };

    if (position.x - radius < 0) collisions.x = 'left';
    else if (position.x + radius > renderer.canvasSize.x)
      collisions.x = 'right';
    else collisions.x = 'no';

    if (position.y - radius < 0) collisions.y = 'top';
    else if (position.y + radius > renderer.canvasSize.y)
      collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  if (gameObject.objectModel.shape === 'rectangle') {
    const halfSizeX = gameObject.objectModel.size.x / 2;
    const halfSizeY = gameObject.objectModel.size.y / 2;
    const position = gameObject.position;
    let collisions: Collision = { x: 'no', y: 'no' };

    if (position.x - halfSizeX < 0) collisions.x = 'left';
    else if (position.x + halfSizeX > renderer.canvasSize.x)
      collisions.x = 'right';
    else {
      collisions.x = 'no';
    }

    if (position.y - halfSizeY < 0) collisions.y = 'top';
    else if (position.y + halfSizeY > renderer.canvasSize.y)
      collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  throw new Error('Unknown shape!');
}
