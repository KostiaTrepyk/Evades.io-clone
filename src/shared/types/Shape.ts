export const Shapes = {
  circle: 'circle',
  rectangle: 'rectangle',
} as const;

export type Shape = (typeof Shapes)[keyof typeof Shapes];

export type CircleShape = typeof Shapes.circle;
export type RectangleShape = typeof Shapes.rectangle;
