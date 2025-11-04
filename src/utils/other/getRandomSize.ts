export function getRandomSize(minSize: number, maxSize: number) {
  return Math.random() * (maxSize - minSize) + minSize;
}
