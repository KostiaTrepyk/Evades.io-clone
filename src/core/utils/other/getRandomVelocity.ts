export function getRandomVelocity(speed: number): { x: number; y: number } {
  const randomX = Math.random() * speed;
  const randomY = speed - randomX;

  const xDirection = Math.random() < 0.5 ? -1 : 1;
  const x = randomX * xDirection;

  const yDirection = Math.random() < 0.5 ? -1 : 1;
  const y = randomY * yDirection;

  return { x, y };
}
