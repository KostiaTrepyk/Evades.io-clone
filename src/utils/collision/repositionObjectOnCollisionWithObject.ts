import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import type { Collision } from '@shared-types/Collision';

export function repositionObjectOnCollisionWithObject(
  object1: RectangleObject | CircleObject,
  object2: RectangleObject | CircleObject,
  collision: Collision,
): void {
  // Getting sizes of object 1
  const object1HalfSize = { x: 0, y: 0 };

  if (object1.shape === 'circle') object1HalfSize.x = object1.radius;
  else object1HalfSize.x = object1.size.width / 2;
  if (object1.shape === 'circle') object1HalfSize.y = object1.radius;
  else object1HalfSize.y = object1.size.height / 2;

  // Getting sizes of object 2
  const object2HalfSize = { x: 0, y: 0 };

  if (object2.shape === 'circle') object2HalfSize.x = object2.radius;
  else object2HalfSize.x = object2.size.width / 2;
  if (object2.shape === 'circle') object2HalfSize.y = object2.radius;
  else object2HalfSize.y = object2.size.height / 2;

  // Updating position of object 1
  if (collision.x === 'left') {
    const object2Right = object2.position.x + object2HalfSize.x;
    object1.position.x = object2Right + object1HalfSize.x;
    return;
  }
  if (collision.x === 'right') {
    const object2Left = object2.position.x - object2HalfSize.x;
    object1.position.x = object2Left - object1HalfSize.x;
    return;
  }
  if (collision.y === 'top') {
    const object2Bottom = object2.position.y + object2HalfSize.y;
    object1.position.y = object2Bottom + object1HalfSize.y;
    return;
  }
  if (collision.y === 'bottom') {
    const object2Top = object2.position.y - object2HalfSize.y;
    object1.position.y = object2Top - object1HalfSize.y;
    return;
  }
}
