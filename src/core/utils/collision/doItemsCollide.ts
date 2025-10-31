import { GameObject } from '../../common/GameObject/GameObject';

interface DoItemsCollideReturn {
  doesCollide: boolean;
  collisions: {
    x: 'left' | 'right' | 'no';
    y: 'top' | 'bottom' | 'no';
  };
}

// Сделал AI - не проверял всё ли правильно написано!
export function doItemsCollide(
  item1: GameObject<'circle' | 'rectangle'>,
  item2: GameObject<'circle' | 'rectangle'>
): DoItemsCollideReturn {
  const shape1 = item1.objectModel.shape;
  const shape2 = item2.objectModel.shape;

  const sideXFor = (fromX: number, toX: number) =>
    toX > fromX ? 'right' : 'left';
  const sideYFor = (fromY: number, toY: number) =>
    toY > fromY ? 'bottom' : 'top';

  // relative movement of item2 seen from item1 between prev and current frames
  const relMove = {
    x:
      item2.position.x -
      item2.prevPosition.x -
      (item1.position.x - item1.prevPosition.x),
    y:
      item2.position.y -
      item2.prevPosition.y -
      (item1.position.y - item1.prevPosition.y),
  };

  // --- circle-circle ---
  if (shape1 === 'circle' && shape2 === 'circle') {
    const radius1 = item1.objectModel.radius;
    const radius2 = item2.objectModel.radius;

    const dx = item2.position.x - item1.position.x;
    const dy = item2.position.y - item1.position.y;
    const distance = Math.hypot(dx, dy);

    const doesCollide = distance < radius1 + radius2;
    let collisions: DoItemsCollideReturn['collisions'] = { x: 'no', y: 'no' };

    if (!doesCollide)
      return { doesCollide: doesCollide, collisions: collisions };

    // prev vector between centers
    const prevDx = item2.prevPosition.x - item1.prevPosition.x;
    const prevDy = item2.prevPosition.y - item1.prevPosition.y;
    const prevDist = Math.hypot(prevDx, prevDy);
    const rsum = radius1 + radius2;

    // Если раньше не было пересечения, а сейчас есть — определяем направление по нормали контакта
    if (prevDist >= rsum && distance !== 0) {
      const nx = dx / distance;
      const ny = dy / distance;
      // проекция относительного движения на нормаль
      const proj = relMove.x * nx + relMove.y * ny;
      if (proj !== 0) {
        if (Math.abs(nx) > Math.abs(ny))
          collisions.x = nx > 0 ? 'right' : 'left';
        else collisions.y = ny > 0 ? 'bottom' : 'top';
        return { doesCollide: doesCollide, collisions: collisions };
      }
    }

    // Fallback — доминирующая компонента между центрами
    if (Math.abs(dx) > Math.abs(dy)) collisions.x = dx > 0 ? 'right' : 'left';
    else collisions.y = dy > 0 ? 'bottom' : 'top';

    return { doesCollide, collisions };
  }

  // --- rectangle-rectangle ---
  if (shape1 === 'rectangle' && shape2 === 'rectangle') {
    const halfWidth1 = item1.objectModel.size.x / 2;
    const halfHeight1 = item1.objectModel.size.y / 2;
    const halfWidth2 = item2.objectModel.size.x / 2;
    const halfHeight2 = item2.objectModel.size.y / 2;

    const left1 = item1.position.x - halfWidth1;
    const right1 = item1.position.x + halfWidth1;
    const top1 = item1.position.y - halfHeight1;
    const bottom1 = item1.position.y + halfHeight1;

    const left2 = item2.position.x - halfWidth2;
    const right2 = item2.position.x + halfWidth2;
    const top2 = item2.position.y - halfHeight2;
    const bottom2 = item2.position.y + halfHeight2;

    const overlapX = Math.min(right1, right2) - Math.max(left1, left2);
    const overlapY = Math.min(bottom1, bottom2) - Math.max(top1, top2);

    const doesCollide = overlapX > 0 && overlapY > 0;
    let collisions: DoItemsCollideReturn['collisions'] = { x: 'no', y: 'no' };

    if (!doesCollide)
      return { doesCollide: doesCollide, collisions: collisions };

    // prev bounds
    const left1Prev = item1.prevPosition.x - halfWidth1;
    const right1Prev = item1.prevPosition.x + halfWidth1;
    const top1Prev = item1.prevPosition.y - halfHeight1;
    const bottom1Prev = item1.prevPosition.y + halfHeight1;

    const left2Prev = item2.prevPosition.x - halfWidth2;
    const right2Prev = item2.prevPosition.x + halfWidth2;
    const top2Prev = item2.prevPosition.y - halfHeight2;
    const bottom2Prev = item2.prevPosition.y + halfHeight2;

    const prevOverlapX =
      Math.min(right1Prev, right2Prev) - Math.max(left1Prev, left2Prev);
    const prevOverlapY =
      Math.min(bottom1Prev, bottom2Prev) - Math.max(top1Prev, top2Prev);

    // Если раньше не было перекрытия — определяем, через какую границу прошёл item2
    if (prevOverlapX <= 0 || prevOverlapY <= 0) {
      if (right2Prev <= left1 && right2 > left1) {
        collisions.x = 'left';
        return { doesCollide: doesCollide, collisions: collisions };
      }
      if (left2Prev >= right1 && left2 < right1) {
        collisions.x = 'right';
        return { doesCollide: doesCollide, collisions: collisions };
      }
      if (bottom2Prev <= top1 && bottom2 > top1) {
        collisions.y = 'top';
        return { doesCollide: doesCollide, collisions: collisions };
      }
      if (top2Prev >= bottom1 && top2 < bottom1) {
        collisions.y = 'bottom';
        return { doesCollide: doesCollide, collisions: collisions };
      }
    }

    // Fallback: ось с меньшей глубиной проникновения
    if (overlapX < overlapY)
      collisions.x = sideXFor(item1.position.x, item2.position.x);
    else collisions.y = sideYFor(item1.position.y, item2.position.y);

    return { doesCollide: doesCollide, collisions: collisions };
  }

  // --- circle-rectangle (one is circle, other rectangle) ---
  const circle = (shape1 === 'circle' ? item1 : item2) as GameObject<'circle'>;
  const rectangle = (
    shape1 === 'rectangle' ? item1 : item2
  ) as GameObject<'rectangle'>;
  const circleIsItem1 = circle === item1;

  const halfWidth = rectangle.objectModel.size.x / 2;
  const halfHeight = rectangle.objectModel.size.y / 2;

  const rectLeft = rectangle.position.x - halfWidth;
  const rectRight = rectangle.position.x + halfWidth;
  const rectTop = rectangle.position.y - halfHeight;
  const rectBottom = rectangle.position.y + halfHeight;

  const nearestX = Math.max(rectLeft, Math.min(circle.position.x, rectRight));
  const nearestY = Math.max(rectTop, Math.min(circle.position.y, rectBottom));

  const distanceX = circle.position.x - nearestX;
  const distanceY = circle.position.y - nearestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  const radius = circle.objectModel.radius;

  const doesCollide = distanceSquared < radius * radius;
  let rawCollisions: DoItemsCollideReturn['collisions'] = { x: 'no', y: 'no' };

  if (!doesCollide)
    return { doesCollide: doesCollide, collisions: { x: 'no', y: 'no' } };

  // prev rect bounds and prev nearest point
  const rectLeftPrev = rectangle.prevPosition.x - halfWidth;
  const rectRightPrev = rectangle.prevPosition.x + halfWidth;
  const rectTopPrev = rectangle.prevPosition.y - halfHeight;
  const rectBottomPrev = rectangle.prevPosition.y + halfHeight;

  const nearestXPrev = Math.max(
    rectLeftPrev,
    Math.min(circle.prevPosition.x, rectRightPrev)
  );
  const nearestYPrev = Math.max(
    rectTopPrev,
    Math.min(circle.prevPosition.y, rectBottomPrev)
  );

  const dXPrev = circle.prevPosition.x - nearestXPrev;
  const dYPrev = circle.prevPosition.y - nearestYPrev;
  const distPrevSq = dXPrev * dXPrev + dYPrev * dYPrev;

  const wasCollisionBefore = distPrevSq < radius * radius;

  if (!wasCollisionBefore) {
    // Определяем откуда подошёл круг используя prev center относительно prev rect
    const centerInsideXPrev =
      circle.prevPosition.x >= rectLeftPrev &&
      circle.prevPosition.x <= rectRightPrev;
    const centerInsideYPrev =
      circle.prevPosition.y >= rectTopPrev &&
      circle.prevPosition.y <= rectBottomPrev;

    if (centerInsideXPrev && !centerInsideYPrev) {
      rawCollisions.y =
        circle.prevPosition.y > rectangle.prevPosition.y ? 'bottom' : 'top';
    } else if (centerInsideYPrev && !centerInsideXPrev) {
      rawCollisions.x =
        circle.prevPosition.x > rectangle.prevPosition.x ? 'right' : 'left';
    } else if (!centerInsideXPrev && !centerInsideYPrev) {
      // угол — решаем по доминирующей компоненте текущих центров
      const dx = circle.position.x - rectangle.position.x;
      const dy = circle.position.y - rectangle.position.y;
      if (Math.abs(dx) > Math.abs(dy))
        rawCollisions.x = dx > 0 ? 'right' : 'left';
      else rawCollisions.y = dy > 0 ? 'bottom' : 'top';
    } else {
      // prev center был внутри rect — минимальная глубина проникновения
      const penX =
        halfWidth - Math.abs(circle.position.x - rectangle.position.x);
      const penY =
        halfHeight - Math.abs(circle.position.y - rectangle.position.y);
      if (penX < penY)
        rawCollisions.x =
          circle.position.x > rectangle.position.x ? 'right' : 'left';
      else
        rawCollisions.y =
          circle.position.y > rectangle.position.y ? 'bottom' : 'top';
    }
  }

  // Если все ещё нет результата — fallback по проекциям/доминирующей компоненте
  if (rawCollisions.x === 'no' && rawCollisions.y === 'no') {
    const centerInsideX =
      circle.position.x >= rectLeft && circle.position.x <= rectRight;
    const centerInsideY =
      circle.position.y >= rectTop && circle.position.y <= rectBottom;

    if (centerInsideX && !centerInsideY)
      rawCollisions.y =
        circle.position.y > rectangle.position.y ? 'bottom' : 'top';
    else if (centerInsideY && !centerInsideX)
      rawCollisions.x =
        circle.position.x > rectangle.position.x ? 'right' : 'left';
    else if (centerInsideX && centerInsideY) {
      const penX =
        halfWidth - Math.abs(circle.position.x - rectangle.position.x);
      const penY =
        halfHeight - Math.abs(circle.position.y - rectangle.position.y);
      if (penX < penY)
        rawCollisions.x =
          circle.position.x > rectangle.position.x ? 'right' : 'left';
      else
        rawCollisions.y =
          circle.position.y > rectangle.position.y ? 'bottom' : 'top';
    } else {
      const dx = circle.position.x - rectangle.position.x;
      const dy = circle.position.y - rectangle.position.y;
      if (Math.abs(dx) > Math.abs(dy))
        rawCollisions.x = dx > 0 ? 'right' : 'left';
      else rawCollisions.y = dy > 0 ? 'bottom' : 'top';
    }
  }

  // rawCollisions описывает сторону прямоугольника; нужно вернуть сторону относительно item1
  let collisions: DoItemsCollideReturn['collisions'] = { x: 'no', y: 'no' };
  if (circleIsItem1) {
    if (rawCollisions.x === 'left') collisions.x = 'right';
    else if (rawCollisions.x === 'right') collisions.x = 'left';
    if (rawCollisions.y === 'top') collisions.y = 'bottom';
    else if (rawCollisions.y === 'bottom') collisions.y = 'top';
  } else {
    collisions = rawCollisions;
  }

  return { doesCollide, collisions };
}
