import { Position } from "./types/Position";

export class Interaction {
  constructor() {}

  intersect(
    item1: {
      position: Position;
      size: number;
      shape: "circle" | "square";
    },
    item2: {
      position: Position;
      size: number;
      shape: "circle" | "square";
    }
  ): boolean {
    if (item1.shape === "circle" && item2.shape === "circle") {
      // Check intersection for two circles
      const distance = Math.hypot(
        item2.position.x - item1.position.x,
        item2.position.y - item1.position.y
      );
      return distance < item1.size / 2 + item2.size / 2;
    }
    if (item1.shape === "square" && item2.shape === "square") {
      // Check intersection for two squares
      const halfSize1 = item1.size / 2;
      const halfSize2 = item2.size / 2;
      const maxX1 = item1.position.x + halfSize1;
      const minX1 = item1.position.x - halfSize1;
      const maxY1 = item1.position.y + halfSize1;
      const minY1 = item1.position.y - halfSize1;

      const maxX2 = item2.position.x + halfSize2;
      const minX2 = item2.position.x - halfSize2;
      const maxY2 = item2.position.y + halfSize2;
      const minY2 = item2.position.y - halfSize2;

      return maxX1 > minX2 && minX1 < maxX2 && maxY1 > minY2 && minY1 < maxY2;
    }

    // Check intersection for a circle and a square
    const circle = item1.shape === "circle" ? item1 : item2;
    const square = item1.shape === "square" ? item1 : item2;

    const halfSize = square.size / 2;
    const maxX = square.position.x + halfSize;
    const minX = square.position.x - halfSize;
    const maxY = square.position.y + halfSize;
    const minY = square.position.y - halfSize;

    const closestX = Math.max(minX, Math.min(circle.position.x, maxX));
    const closestY = Math.max(minY, Math.min(circle.position.y, maxY));

    const distance = Math.hypot(
      closestX - circle.position.x,
      closestY - circle.position.y
    );

    return distance < circle.size / 2;
  }
}
