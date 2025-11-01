import { Position } from './Position';
import { CircleShape, RectangleShape, Shape } from './Shape';

export type Boundary<S extends Shape> = S extends CircleShape
  ? CircleBoundary
  : RectangleBoundary;

export interface CircleBoundary {
  shape: CircleShape;
  position: Position;
  radius: number;
}

export interface RectangleBoundary {
  shape: RectangleShape;
  from: { x: number; y: number };
  to: { x: number; y: number };
}
