import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import { Projectile } from '@game/objects/projectile/projectile';
import { MCollisionPlayer } from '@modules/collision/MCollisionPlayer';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import type { HSLA } from '@utils/hsla';

export interface NecroFirstSpellProjectileParams {
  startPosition: Position;
  radius: number;
  velocity: Velocity;
  color: HSLA;
}

export class NecroFirstSpellProjectile extends Projectile {
  private readonly _MCollisionPlayer: MCollisionPlayer;

  constructor(params: NecroFirstSpellProjectileParams) {
    super({
      startPosition: params.startPosition,
      radius: params.radius,
      velocity: params.velocity,
      color: params.color,
    });

    this._MCollisionPlayer = new MCollisionPlayer({
      object: this,
      onCollision: this._handleCollision.bind(this),
    });
  }

  public override afterUpdate(): void {
    super.afterUpdate?.();
    this._MCollisionPlayer.afterUpdate();
  }

  private _handleCollision(player: CharacterBase): void {
    player.revive();
  }
}
