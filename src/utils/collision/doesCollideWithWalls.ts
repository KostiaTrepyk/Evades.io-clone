import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { renderer } from '@core/global';
import type { Collision } from '@shared-types/Collision';

interface DoesCollideWithWallsReturn {
  doesCollide: boolean;
  collisions: {
    x: 'left' | 'right' | 'no';
    y: 'top' | 'bottom' | 'no';
  };
}

export function doesCollideWithWalls(
  gameObject: RectangleObject | CircleObject,
): DoesCollideWithWallsReturn {
  if (gameObject.shape === 'circle') {
    const radius = gameObject.radius;
    const position = gameObject.position;
    const collisions: Collision = { x: 'no', y: 'no' };

    if (position.x - radius < 0) collisions.x = 'left';
    else if (position.x + radius > renderer.canvasSize.x) collisions.x = 'right';
    else collisions.x = 'no';

    if (position.y - radius < 0) collisions.y = 'top';
    else if (position.y + radius > renderer.canvasSize.y) collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  if (gameObject.shape === 'rectangle') {
    const halfSizeX = gameObject.size.width / 2;
    const halfSizeY = gameObject.size.height / 2;
    const position = gameObject.position;
    const collisions: Collision = { x: 'no', y: 'no' };

    if (position.x - halfSizeX < 0) collisions.x = 'left';
    else if (position.x + halfSizeX > renderer.canvasSize.x) collisions.x = 'right';
    else {
      collisions.x = 'no';
    }

    if (position.y - halfSizeY < 0) collisions.y = 'top';
    else if (position.y + halfSizeY > renderer.canvasSize.y) collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  throw new Error('Unknown shape!');
}
