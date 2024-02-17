import { GameObject } from "./common/GameObject";

export function doItemsIntersect(
  item1: GameObject<"circle" | "rectangle">,
  item2: GameObject<"circle" | "rectangle">
): boolean {
  const shape1 = item1.objectModel.shape;
  const shape2 = item2.objectModel.shape;

  // If both items are circles
  if (shape1 === "circle" && shape2 === "circle") {
    const radius1 = item1.objectModel.size / 2;
    const radius2 = item2.objectModel.size / 2;

    const distanceBetweenCenters = Math.hypot(
      item2.position.x - item1.position.x,
      item2.position.y - item1.position.y
    );

    return distanceBetweenCenters < radius1 + radius2;
  }
  // If both items are rectangles
  if (shape1 === "rectangle" && shape2 === "rectangle") {
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

    return !(
      left2 > right1 ||
      right2 < left1 ||
      top2 > bottom1 ||
      bottom2 < top1
    );
  }
  
  // If one item is a circle and the other is a rectangle
  const circle = (shape1 === "circle" ? item1 : item2) as GameObject<"circle">;
  const rectangle = (
    shape1 === "rectangle" ? item1 : item2
  ) as GameObject<"rectangle">;

  const halfWidth = rectangle.objectModel.size.x / 2;
  const halfHeight = rectangle.objectModel.size.y / 2;

  const nearestX = Math.max(
    rectangle.position.x - halfWidth,
    Math.min(circle.position.x, rectangle.position.x + halfWidth)
  );
  const nearestY = Math.max(
    rectangle.position.y - halfHeight,
    Math.min(circle.position.y, rectangle.position.y + halfHeight)
  );

  const distanceX = circle.position.x - nearestX;
  const distanceY = circle.position.y - nearestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  const radius = circle.objectModel.size / 2;

  return distanceSquared < radius * radius;
}
