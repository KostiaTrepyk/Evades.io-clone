import { MCollisionWalls } from '../../core/modules/collision/MCollisionWalls';
import { MCollisionEnemy } from '../../core/modules/collision/MCollisionEnemy';
import { MCollisionPointOrb } from '../../core/modules/collision/MCollisionPointOrb';
import { Enemy } from '../enemy/enemy';
import { PointOrb } from '../pointOrb/PointOrb';
import { Character } from './character';

export class CharacterCollision {
  private player: Character;
  private mCollisionWalls: MCollisionWalls;
  private mCollisionEnemy: MCollisionEnemy;
  private mCollisionPointOrb: MCollisionPointOrb;

  constructor(player: Character) {
    this.player = player;

    this.mCollisionWalls = new MCollisionWalls({
      object: player,
      collisionType: 'applyCollision',
    });
    this.mCollisionEnemy = new MCollisionEnemy({
      object: player,
      onCollision: this.onCollisionEnemy.bind(this),
    });
    this.mCollisionPointOrb = new MCollisionPointOrb({
      object: player,
      onCollision: this.onCollisionPointOrb.bind(this),
    });
  }

  public afterUpdate(deltaTime: number): void {
    this.mCollisionWalls.afterUpdate(deltaTime);
    this.mCollisionEnemy.afterUpdate(deltaTime);
    this.mCollisionPointOrb.afterUpdate(deltaTime);
  }

  private onCollisionEnemy(enemy: Enemy): void {
    if (!this.player.isDead) {
      this.player.die();
    }
  }

  private onCollisionPointOrb(pointOrb: PointOrb): void {
    pointOrb.delete();
    this.player.level.addPointOrb();
  }
}
