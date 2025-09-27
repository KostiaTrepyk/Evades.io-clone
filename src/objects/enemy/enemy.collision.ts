import { doItemsIntersect } from '../../core/utils/collision/doItemsIntersect';
import { gameObjectManager } from '../../core/global';
import { SaveZone } from '../saveZone/SaveZone';
import { Enemy } from './enemy';
import { applyCollisionWithWalls } from '../../core/utils/collision/applyCollisionWithWalls';

export class EnemyCollision {
  private _enemy: Enemy;

  constructor(enemy: Enemy) {
    this._enemy = enemy;
  }

  public onUpdate(): void {
    // Check for collisions with walls
    applyCollisionWithWalls(this._enemy, (collision) => {
      if (collision.x) this._enemy.velocity.x *= -1;
      if (collision.y) this._enemy.velocity.y *= -1;
    });

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
}
