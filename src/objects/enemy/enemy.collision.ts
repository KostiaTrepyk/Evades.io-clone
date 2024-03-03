import { doItemsIntersect } from '../../core/doItemsIntersect';
import { gameObjectManager, renderer } from '../../core/global';
import { SaveZone } from '../saveZone/SaveZone';
import { Enemy } from './enemy';

export class EnemyCollision {
  private _enemy: Enemy;

  constructor(enemy: Enemy) {
    this._enemy = enemy;
  }

  public onUpdate(): void {
    // Check for collisions with walls
    const { newPosition, newVelocity } = this.boundaryCollision();
    this._enemy.position = newPosition;
    this._enemy.velocity = newVelocity;

    // Check for collisions with save zones
    gameObjectManager.saveZones.forEach(this.collisionWithSaveZone.bind(this));
  }

  private collisionWithSaveZone(saveZone: SaveZone) {
    const saveZoneLeft = saveZone.position.x - saveZone.objectModel.size.x / 2;
    const saveZoneRight = saveZone.position.x + saveZone.objectModel.size.x / 2;
    const saveZoneTop = saveZone.position.y - saveZone.objectModel.size.y / 2;
    const saveZoneBottom =
      saveZone.position.y + saveZone.objectModel.size.y / 2;

    if (doItemsIntersect(this._enemy, saveZone)) {
      const { position, velocity, objectModel } = this._enemy;

      // Calculate the overlap on each side
      const overlaps = {
        left: saveZoneRight - position.x + objectModel.size / 2,
        right: position.x + objectModel.size / 2 - saveZoneLeft,
        top: saveZoneBottom - position.y + objectModel.size / 2,
        bottom: position.y + objectModel.size / 2 - saveZoneTop,
      };

      // Find the minimum overlap
      const minOverlap = Math.min(
        overlaps.left,
        overlaps.right,
        overlaps.top,
        overlaps.bottom
      );

      // Adjust the position and velocity based on the minimum overlap
      if (minOverlap === overlaps.left) {
        position.x = saveZoneRight + objectModel.size / 2;
        velocity.x = -velocity.x;
      } else if (minOverlap === overlaps.right) {
        position.x = saveZoneLeft - objectModel.size / 2;
        velocity.x = -velocity.x;
      } else if (minOverlap === overlaps.top) {
        position.y = saveZoneBottom + objectModel.size / 2;
        velocity.y = -velocity.y;
      } else if (minOverlap === overlaps.bottom) {
        position.y = saveZoneTop - objectModel.size / 2;
        velocity.y = -velocity.y;
      }
    }
  }

  private boundaryCollision() {
    const handleAxisCollision = (axis: 'x' | 'y') => {
      let newPosition: number;
      let newVelocity: number;

      const { position, velocity, objectModel } = this._enemy;

      const axisPosition = position[axis];
      const halfSize = objectModel.size / 2;
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
    const x = handleAxisCollision('x');
    const y = handleAxisCollision('y');

    return {
      newPosition: { x: x.newPosition, y: y.newPosition },
      newVelocity: { x: x.newVelocity, y: y.newVelocity },
    };
  }
}
