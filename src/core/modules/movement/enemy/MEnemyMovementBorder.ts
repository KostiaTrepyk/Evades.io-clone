import { MCollisionSaveZone } from '../../collision/MCollisionSaveZone';
import { MCollisionWalls } from '../../collision/MCollisionWalls';
import { Collision } from '../../../types/Collision';
import { Enemy } from '../../../../objects/enemy/enemy';
import { AMEnemyMovement } from './MEnemyMovement.type';

export class MEnemyMovementBorder implements AMEnemyMovement {
  private enemy: Enemy;
  private mCollisionWalls: MCollisionWalls;
  private mCollisionSaveZone: MCollisionSaveZone;

  constructor(enemy: Enemy) {
    this.enemy = enemy;

    this.mCollisionWalls = new MCollisionWalls({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithWallsHandler.bind(this),
    });

    this.mCollisionSaveZone = new MCollisionSaveZone({
      object: enemy,
      collisionType: 'applyCollision',
      onCollision: this.collisionWithSaveZonesHandler.bind(this),
    });
  }

  public afterUpdate(deltaTime: number): void {
    this.mCollisionWalls.afterUpdate(deltaTime);
    this.mCollisionSaveZone.afterUpdate(deltaTime);
  }

  private collisionWithWallsHandler(collision: Collision): void {
    const newVelocity = this.enemy.velocity;

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

    this.enemy.setVelocity = newVelocity;
  }

  private collisionWithSaveZonesHandler(collision: Collision): void {
    const newVelocity = this.enemy.velocity;

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

    this.enemy.setVelocity = newVelocity;
  }
}
