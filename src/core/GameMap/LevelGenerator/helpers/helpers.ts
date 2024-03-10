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

export function getRandomVelocity(speed: number): { x: number; y: number } {
  const randomX = Math.random() * speed;
  const randomY = speed - randomX;

  const xDirection = Math.random() < 0.5 ? -1 : 1;
  const x = randomX * xDirection;

  const yDirection = Math.random() < 0.5 ? -1 : 1;
  const y = randomY * yDirection;

  return { x, y };
}

export function getRandomSize(minSize: number, maxSize: number) {
  return Math.random() * (maxSize - minSize) + minSize;
}
