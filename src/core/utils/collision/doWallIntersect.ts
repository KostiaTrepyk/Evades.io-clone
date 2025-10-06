import { GameObject } from '../../common/GameObject';
import { renderer } from '../../global';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';

interface DoWallIntersectReturn {
  doesIntersect: boolean;
  intersections: {
    x: 'left' | 'right' | 'no';
    y: 'top' | 'bottom' | 'no';
  };
}

export function doWallIntersect(
  gameObject: GameObject<Shape>
): DoWallIntersectReturn {
  if (gameObject.objectModel.shape === 'circle') {
    const halfSize = gameObject.objectModel.size / 2;
    const position = gameObject.position;
    let intersections: Collision = { x: 'no', y: 'no' };

    if (position.x - halfSize < 0) intersections.x = 'left';
    else if (position.x + halfSize > renderer.canvasSize.x)
      intersections.x = 'right';
    else intersections.x = 'no';

    if (position.y - halfSize < 0) intersections.y = 'top';
    else if (position.y + halfSize > renderer.canvasSize.y)
      intersections.y = 'bottom';
    else intersections.y = 'no';

    const doesIntersect = !(
      intersections.x === 'no' && intersections.y === 'no'
    );

    return { doesIntersect, intersections };
  }

  if (gameObject.objectModel.shape === 'rectangle') {
    const halfSizeX = gameObject.objectModel.size.x / 2;
    const halfSizeY = gameObject.objectModel.size.y / 2;
    const position = gameObject.position;
    let intersections: Collision = { x: 'no', y: 'no' };

    if (position.x - halfSizeX < 0) intersections.x = 'left';
    else if (position.x + halfSizeX > renderer.canvasSize.x)
      intersections.x = 'right';
    else {
      intersections.x = 'no';
    }

    if (position.y - halfSizeY < 0) intersections.y = 'top';
    else if (position.y + halfSizeY > renderer.canvasSize.y)
      intersections.y = 'bottom';
    else intersections.y = 'no';

    const doesIntersect = !(
      intersections.x === 'no' && intersections.y === 'no'
    );

    return { doesIntersect, intersections };
  }

  throw new Error('Unknown shape!');
}
