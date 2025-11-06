import type { CircleObject } from '@core/common/CircleObject/CircleObject';
import type { RectangleObject } from '@core/common/RectangleObject/RectangleObject';

interface DoItemsCollideReturn {
  doesCollide: boolean;
  collisions: {
    x: 'left' | 'right' | 'no';
    y: 'top' | 'bottom' | 'no';
  };
}

export function doItemsCollide(
  item1: RectangleObject | CircleObject,
  item2: RectangleObject | CircleObject,
): DoItemsCollideReturn {
  const shape1 = item1.shape;
  const shape2 = item2.shape;

  const dirX = (a: number, b: number) => (a < b ? 'right' : 'left');
  const dirY = (a: number, b: number) => (a < b ? 'bottom' : 'top');

  // --- 🔵 Circle–Circle ---
  if (shape1 === 'circle' && shape2 === 'circle') {
    const r1 = item1.radius;
    const r2 = item2.radius;

    const dx = item2.position.x - item1.position.x;
    const dy = item2.position.y - item1.position.y;
    const dist = Math.hypot(dx, dy);
    const sum = r1 + r2;

    if (dist >= sum) return { doesCollide: false, collisions: { x: 'no', y: 'no' } };

    // Направление по доминирующей оси
    if (Math.abs(dx) > Math.abs(dy))
      return {
        doesCollide: true,
        collisions: { x: dirX(item1.position.x, item2.position.x), y: 'no' },
      };
    return {
      doesCollide: true,
      collisions: { x: 'no', y: dirY(item1.position.y, item2.position.y) },
    };
  }

  // --- 🟦 Rectangle–Rectangle ---
  if (shape1 === 'rectangle' && shape2 === 'rectangle') {
    const size1 = item1.size;
    const size2 = item2.size;

    const b1 = {
      left: item1.position.x - size1.width / 2,
      right: item1.position.x + size1.width / 2,
      top: item1.position.y - size1.height / 2,
      bottom: item1.position.y + size1.height / 2,
    };
    const b2 = {
      left: item2.position.x - size2.width / 2,
      right: item2.position.x + size2.width / 2,
      top: item2.position.y - size2.height / 2,
      bottom: item2.position.y + size2.height / 2,
    };

    const overlapX = Math.min(b1.right, b2.right) - Math.max(b1.left, b2.left);
    const overlapY = Math.min(b1.bottom, b2.bottom) - Math.max(b1.top, b2.top);

    if (overlapX <= 0 || overlapY <= 0)
      return { doesCollide: false, collisions: { x: 'no', y: 'no' } };

    // Определяем по оси с меньшим проникновением
    if (overlapX < overlapY)
      return {
        doesCollide: true,
        collisions: { x: dirX(item1.position.x, item2.position.x), y: 'no' },
      };
    return {
      doesCollide: true,
      collisions: { x: 'no', y: dirY(item1.position.y, item2.position.y) },
    };
  }

  // --- 🟢 Circle–Rectangle ---
  const circle = shape1 === 'circle' ? item1 : (item2 as CircleObject);
  const rect = shape1 === 'rectangle' ? item1 : (item2 as RectangleObject);
  const circleIsItem1 = shape1 === 'circle';

  const half = {
    x: rect.size.width / 2,
    y: rect.size.height / 2,
  };
  const rectLeft = rect.position.x - half.x;
  const rectRight = rect.position.x + half.x;
  const rectTop = rect.position.y - half.y;
  const rectBottom = rect.position.y + half.y;

  // Ближайшая точка на прямоугольнике к кругу
  const nearestX = Math.max(rectLeft, Math.min(circle.position.x, rectRight));
  const nearestY = Math.max(rectTop, Math.min(circle.position.y, rectBottom));

  const dx = circle.position.x - nearestX;
  const dy = circle.position.y - nearestY;
  const distSq = dx * dx + dy * dy;
  const r = circle.radius;

  if (distSq >= r * r) return { doesCollide: false, collisions: { x: 'no', y: 'no' } };

  // Определяем направление столкновения
  let collisions: DoItemsCollideReturn['collisions'];
  if (Math.abs(dx) > Math.abs(dy))
    collisions = { x: dirX(rect.position.x, circle.position.x), y: 'no' };
  else collisions = { x: 'no', y: dirY(rect.position.y, circle.position.y) };

  // Если круг — item1, то инвертируем направление
  if (circleIsItem1) {
    if (collisions.x === 'left') collisions.x = 'right';
    else if (collisions.x === 'right') collisions.x = 'left';
    if (collisions.y === 'top') collisions.y = 'bottom';
    else if (collisions.y === 'bottom') collisions.y = 'top';
  }

  return { doesCollide: true, collisions };
}
