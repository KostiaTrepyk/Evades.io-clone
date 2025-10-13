export function getRandomPosition({
  minX,
  maxX,
  minY,
  maxY,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) {
  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}
