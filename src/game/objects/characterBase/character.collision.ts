import type { EnemyBase } from '../enemyBase/enemyBase';
import type { PointOrb } from '../pointOrb/PointOrb';

import type { CharacterBase } from './characterBase';

import type { Module } from '@core/common/Module';
import { MCollisionEnemy } from '@core/modules/collision/MCollisionEnemy';
import { MCollisionPointOrb } from '@core/modules/collision/MCollisionPointOrb';
import { MCollisionWalls } from '@core/modules/collision/MCollisionWalls';

export class CharacterCollision implements Module {
  private readonly _player: CharacterBase;
  private readonly _MCollisionWalls: MCollisionWalls;
  private readonly _MCollisionEnemy: MCollisionEnemy;
  private readonly _MCollisionPointOrb: MCollisionPointOrb;

  constructor(player: CharacterBase) {
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

  private onCollisionEnemy(enemy: EnemyBase): void {
    if (enemy.EnemyStatus.MStatus.isAppliedStatusByName('disabled')) return;
    this._player.die();
  }

  private onCollisionPointOrb(pointOrb: PointOrb): void {
    pointOrb.delete();
    this._player.level.addPointOrb();
  }
}
