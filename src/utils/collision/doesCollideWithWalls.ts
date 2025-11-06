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
  const { width: canvasW, height: canvasH } = renderer.canvasSize;
  const position = gameObject.position;
  const collisions: Collision = { x: 'no', y: 'no' };

  // Circle collision with walls
  if (gameObject.shape === 'circle') {
    const radius = gameObject.radius;

    if (position.x - radius < 0) collisions.x = 'left';
    else if (position.x + radius > canvasW) collisions.x = 'right';
    else collisions.x = 'no';

    if (position.y - radius < 0) collisions.y = 'top';
    else if (position.y + radius > canvasH) collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  // Rectangle collision with walls
  if (gameObject.shape === 'rectangle') {
    const halfSizeX = gameObject.size.width / 2;
    const halfSizeY = gameObject.size.height / 2;

    if (position.x - halfSizeX < 0) collisions.x = 'left';
    else if (position.x + halfSizeX > canvasW) collisions.x = 'right';
    else {
      collisions.x = 'no';
    }

    if (position.y - halfSizeY < 0) collisions.y = 'top';
    else if (position.y + halfSizeY > canvasH) collisions.y = 'bottom';
    else collisions.y = 'no';

    const doesCollide = !(collisions.x === 'no' && collisions.y === 'no');

    return { doesCollide, collisions };
  }

  throw new Error('Unknown shape!');
}
