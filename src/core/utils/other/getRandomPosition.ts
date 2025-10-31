import { Position } from '../../types/Position';

export interface GetRandomPositionParams {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  exclude?: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }[];
}

/* FIX ME Можно улучшить но нужно подумать как. boundary  */
export function getRandomPosition({
  minX,
  maxX,
  minY,
  maxY,
  exclude,
}: GetRandomPositionParams): Position {
  let times: number = 0;

  while (times <= 20) {
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    if (exclude !== undefined) {
      for (const { from, to } of exclude) {
        const isValidX = x < from.x || x > to.x;
        const isValidY = y < from.y || y > to.y;

        if (isValidX && isValidY) return { x, y };
      }
    } else {
      const x = Math.random() * (maxX - minX) + minX;
      const y = Math.random() * (maxY - minY) + minY;
      return { x, y };
    }
  }

  console.error('Position is not valid.');

  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}
