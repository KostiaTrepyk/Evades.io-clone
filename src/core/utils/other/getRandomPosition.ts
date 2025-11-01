import { Boundary } from '../../types/Boundary';
import { Position } from '../../types/Position';

export interface GetRandomPositionParams {
  allowed: Boundary;
  size: { x: number; y: number };
  excludes?: Boundary[];
}

export function getRandomPosition({
  allowed,
  size,
  excludes,
}: GetRandomPositionParams): Position {
  // If no excludes
  if (excludes === undefined) {
    return {
      x:
        Math.random() * (allowed.to.x - allowed.from.x - size.x) +
        allowed.from.x +
        size.x / 2,
      y:
        Math.random() * (allowed.to.y - allowed.from.y - size.y) +
        allowed.from.y +
        size.y / 2,
    };
  }

  // Start with full allowed rect
  let allowedBoundary: Boundary[] = [
    {
      from: { x: allowed.from.x, y: allowed.from.y },
      to: { x: allowed.to.x, y: allowed.to.y },
    },
  ];

  for (const exclude of excludes) {
    const nextAllowed: Boundary[] = [];

    for (const a of allowedBoundary) {
      const isValidX = a.from.x > exclude.to.x || a.to.x < exclude.from.x;
      const isValidY = a.from.y > exclude.to.y || a.to.y < exclude.from.y;

      if (isValidX || isValidY) {
        nextAllowed.push(a);
        continue;
      }

      if (a.from.y < exclude.from.y) {
        // Add top strip
        nextAllowed.push({
          from: { x: a.from.x, y: a.from.y },
          to: { x: a.to.x, y: exclude.from.y },
        });
      }

      if (a.to.y > exclude.to.y) {
        // Add bottom strip
        nextAllowed.push({
          from: { x: a.from.x, y: exclude.to.y },
          to: { x: a.to.x, y: a.to.y },
        });
      }

      if (a.from.x < exclude.from.x) {
        // Add left strip
        nextAllowed.push({
          from: { x: a.from.x, y: a.from.y },
          to: { x: exclude.from.x, y: a.to.y },
        });
      }

      if (a.to.x > exclude.to.x) {
        // Add right strip
        nextAllowed.push({
          from: { x: exclude.to.x, y: a.from.y },
          to: { x: a.to.x, y: a.to.y },
        });
      }
    }

    allowedBoundary = nextAllowed;
    if (allowedBoundary.length === 0) break;
  }

  // No free area after applying excludes
  if (allowedBoundary.length === 0) {
    console.error(
      'getRandomPosition: no free area after applying excludes, returning center.'
    );
    return {
      x: allowed.from.x + (allowed.to.x - allowed.from.x) / 2,
      y: allowed.from.y + (allowed.to.y - allowed.from.y) / 2,
    };
  }

  console.log(allowedBoundary);
  // Compute areas and pick one weighted by area
  const areas = allowedBoundary.map(
    (r) => (r.to.x - r.from.x) * (r.to.y - r.from.y)
  );

  const totalArea = areas.reduce((s, a) => s + a, 0);
  let pick = Math.random() * totalArea;
  let idx = 0;
  while (pick > areas[idx]) {
    pick -= areas[idx];
    idx++;
  }
  const chosen = allowedBoundary[idx];

  // Uniform point inside chosen rect
  const x =
    Math.random() * (chosen.to.x - chosen.from.x - size.x) +
    chosen.from.x +
    size.x / 2;
  const y =
    Math.random() * (chosen.to.y - chosen.from.y - size.y) +
    chosen.from.y +
    size.y / 2;
  return { x, y };
}
