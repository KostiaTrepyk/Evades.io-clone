import { renderer } from "../../core/global";
import { Position } from "../../core/types/Position";
import { Velocity } from "../../core/types/Velocity";

export function handleBoundaryCollision(
  position: Position,
  velocity: Velocity,
  size: number
): {
  newPosition: Position;
  newVelocity: Velocity;
} {
  const handleAxisCollision = (axis: "x" | "y") => {
    let newPosition: number;
    let newVelocity: number;

    const axisPosition = position[axis];
    const halfSize = size / 2;
    const minAxisPosition = halfSize;
    const maxAxisPosition = renderer.canvasSize[axis] - halfSize;

    if (axisPosition - halfSize < 0) {
      newPosition = minAxisPosition;
      newVelocity = -velocity[axis];
    } else if (axisPosition > maxAxisPosition) {
      newPosition = maxAxisPosition;
      newVelocity = -velocity[axis];
    } else {
      newPosition = position[axis];
      newVelocity = velocity[axis];
    }

    return { newPosition, newVelocity };
  };
  const x = handleAxisCollision("x");
  const y = handleAxisCollision("y");

  return {
    newPosition: { x: x.newPosition, y: y.newPosition },
    newVelocity: { x: x.newVelocity, y: y.newVelocity },
  };
}
