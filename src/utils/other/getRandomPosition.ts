import type { RectangleBoundary } from '@shared-types/Boundary';
import type { Position } from '@shared-types/Position';

export interface GetRandomPositionParams {
  allowed: RectangleBoundary;
  size: { x: number; y: number };
  excludes?: RectangleBoundary[];
}

/* 
  @param params.allowed - The boundary rectangle within which to generate the position
  @param params.allowed.from - Starting point (top-left) of allowed area
  @param params.allowed.to - Ending point (bottom-right) of allowed area
  @param params.size - Size of the object to position
  @param params.excludes - Array of rectangular areas to avoid when generating position
  
  @returns A Position object containing x,y coordinates within allowed area and outside excluded areas
  
  @remarks
  If excludes are provided, the function splits the allowed area into rectangles that don't overlap
  with excluded areas. It then picks one rectangle weighted by area and generates a uniform random
  position within it. If no valid area remains after applying excludes, returns the center of the
  allowed area.
*/

/** Generates a random position within allowed boundaries while avoiding excluded areas */
export function getRandomPosition({ allowed, size, excludes }: GetRandomPositionParams): Position {
  // If no excludes
  if (excludes === undefined) {
    return {
      x: Math.random() * (allowed.to.x - allowed.from.x - size.x) + allowed.from.x + size.x / 2,
      y: Math.random() * (allowed.to.y - allowed.from.y - size.y) + allowed.from.y + size.y / 2,
    };
  }

  // Start with full allowed rect
  let allowedBoundary: RectangleBoundary[] = [
    {
      shape: 'rectangle',
      from: { x: allowed.from.x, y: allowed.from.y },
      to: { x: allowed.to.x, y: allowed.to.y },
    },
  ];

  for (const exclude of excludes) {
    const nextAllowed: RectangleBoundary[] = [];

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
          shape: 'rectangle',
          from: { x: a.from.x, y: a.from.y },
          to: { x: a.to.x, y: exclude.from.y },
        });
      }

      if (a.to.y > exclude.to.y) {
        // Add bottom strip
        nextAllowed.push({
          shape: 'rectangle',
          from: { x: a.from.x, y: exclude.to.y },
          to: { x: a.to.x, y: a.to.y },
        });
      }

      if (a.from.x < exclude.from.x) {
        // Add left strip
        nextAllowed.push({
          shape: 'rectangle',
          from: { x: a.from.x, y: a.from.y },
          to: { x: exclude.from.x, y: a.to.y },
        });
      }

      if (a.to.x > exclude.to.x) {
        // Add right strip
        nextAllowed.push({
          shape: 'rectangle',
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
    console.error('getRandomPosition: no free area after applying excludes, returning center.');
    return {
      x: allowed.from.x + (allowed.to.x - allowed.from.x) / 2,
      y: allowed.from.y + (allowed.to.y - allowed.from.y) / 2,
    };
  }

  // Compute areas and pick one weighted by area
  const areas = allowedBoundary.map(r => (r.to.x - r.from.x) * (r.to.y - r.from.y));

  const totalArea = areas.reduce((s, a) => s + a, 0);
  let pick = Math.random() * totalArea;
  let idx = 0;
  while (pick > areas[idx]) {
    pick -= areas[idx];
    idx++;
  }
  const chosen = allowedBoundary[idx];

  // Uniform point inside chosen rect
  const x = Math.random() * (chosen.to.x - chosen.from.x - size.x) + chosen.from.x + size.x / 2;
  const y = Math.random() * (chosen.to.y - chosen.from.y - size.y) + chosen.from.y + size.y / 2;
  return { x, y };
}
