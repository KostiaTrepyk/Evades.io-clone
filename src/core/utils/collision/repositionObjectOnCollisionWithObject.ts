import { GameObject } from '../../common/GameObject';
import { Collision } from '../../types/Collision';
import { Shape } from '../../types/Shape';

/** Мутирует object1 */
export function repositionObjectOnCollisionWithObject(
  object1: GameObject<Shape>,
  object2: GameObject<Shape>,
  collision: Collision
) {
  // Получаем размеры объекта 1
  const object1Size = { x: 0, y: 0 };

  if (typeof object1.objectModel.size === 'number')
    object1Size.x = object1.objectModel.size;
  else object1Size.x = object1.objectModel.size.x;
  if (typeof object1.objectModel.size === 'number')
    object1Size.y = object1.objectModel.size;
  else object1Size.y = object1.objectModel.size.y;

  // Получаем размеры объекта 2
  const object2Size = { x: 0, y: 0 };

  if (typeof object2.objectModel.size === 'number')
    object2Size.x = object2.objectModel.size;
  else object2Size.x = object2.objectModel.size.x;
  if (typeof object2.objectModel.size === 'number')
    object2Size.y = object2.objectModel.size;
  else object2Size.y = object2.objectModel.size.y;

  const object2Left = object2.position.x - object2Size.x / 2;
  const object2Right = object2.position.x + object2Size.x / 2;
  const object2Top = object2.position.y - object2Size.y / 2;
  const object2Bottom = object2.position.y + object2Size.y / 2;

  // Обновление позиции объекта 1
  if (collision.x === 'left') {
    object1.position.x = object2Right + object1Size.x / 2;
  }
  if (collision.x === 'right') {
    object1.position.x = object2Left - object1Size.x / 2;
  }
  if (collision.y === 'top') {
    object1.position.y = object2Bottom + object1Size.y / 2;
  }
  if (collision.y === 'bottom') {
    object1.position.y = object2Top - object1Size.y / 2;
  }
}
