import { MCollisionWalls } from '../../core/modules/collision/MCollisionWalls';
import { MCollisionEnemy } from '../../core/modules/collision/MCollisionEnemy';
import { MCollisionPointOrb } from '../../core/modules/collision/MCollisionPointOrb';
import { Enemy } from '../enemy/enemy';
import { PointOrb } from '../pointOrb/PointOrb';
import { Character } from './character';
import { Module } from '../../core/common/Module';

export class CharacterCollision implements Module {
  private readonly _player: Character;
  private readonly _MCollisionWalls: MCollisionWalls;
  private readonly _MCollisionEnemy: MCollisionEnemy;
  private readonly _MCollisionPointOrb: MCollisionPointOrb;

  constructor(player: Character) {
    this._player = player;

    this._MCollisionWalls = new MCollisionWalls({
      object: player,
      collisionType: 'applyCollision',
    });
    this._MCollisionEnemy = new MCollisionEnemy({
      object: player,
      onCollision: this.onCollisionEnemy.bind(this),
    });
    this._MCollisionPointOrb = new MCollisionPointOrb({
      object: player,
      onCollision: this.onCollisionPointOrb.bind(this),
    });
  }

  public afterUpdate(): void {
    this._MCollisionWalls.afterUpdate();
    this._MCollisionEnemy.afterUpdate();
    this._MCollisionPointOrb.afterUpdate();
  }

  private onCollisionEnemy(enemy: Enemy): void {
    if (enemy.EnemyStatus.MStatus.isAppliedStatusByName('disabled')) return;
    this._player.die();
  }

  private onCollisionPointOrb(pointOrb: PointOrb): void {
    pointOrb.delete();
    this._player.level.addPointOrb();
  }
}
