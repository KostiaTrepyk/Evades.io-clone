import { MCollisionSaveZone } from '../../collision/MCollisionSaveZone';
import { MCollisionWalls } from '../../collision/MCollisionWalls';
import { Collision } from '../../../types/Collision';
import { Enemy } from '../../../../objects/enemy/enemy';
import { AMEnemyMovement } from './MEnemyMovement.type';

export class MEnemyMovementBorder implements AMEnemyMovement {
  private _enemy: Enemy;
  private _MCollisionWalls: MCollisionWalls;
  private _MCollisionSaveZone: MCollisionSaveZone;

  constructor(enemy: Enemy) {
    this._enemy = enemy;

    this._MCollisionWalls = new MCollisionWalls({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithWallsHandler.bind(this),
    });

    this._MCollisionSaveZone = new MCollisionSaveZone({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithSaveZonesHandler.bind(this),
    });
  }

  public afterUpdate(deltaTime: number): void {
    this._MCollisionWalls.afterUpdate(deltaTime);
    this._MCollisionSaveZone.afterUpdate(deltaTime);
  }

  private collisionWithWallsHandler(collision: Collision): void {
    const newVelocity = this._enemy.velocity;

    if (collision.x === 'left') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.x === 'right') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    }
    if (collision.y === 'bottom') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.y === 'top') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    }

    this._enemy.setVelocity = newVelocity;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    const newVelocity = this._enemy.velocity;

    if (collision.x === 'left') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.x === 'right') {
      const temp = newVelocity.x;
      newVelocity.x = newVelocity.y;
      newVelocity.y = temp;
    }
    if (collision.y === 'bottom') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    } else if (collision.y === 'top') {
      const temp = newVelocity.x;
      newVelocity.x = -newVelocity.y;
      newVelocity.y = temp;
    }

    this._enemy.setVelocity = newVelocity;
  }
}
