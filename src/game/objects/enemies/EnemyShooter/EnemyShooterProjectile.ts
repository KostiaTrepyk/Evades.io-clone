import { ENEMYCONFIG } from '@config/enemies/enemy.config';
import { ENEMYSHOOTERCONFIG } from '@config/enemies/enemyShooter.config';
import { MCollisionPlayer } from '@core/modules/collision/MCollisionPlayer';
import { MCollisionSaveZone } from '@core/modules/collision/MCollisionSaveZone';
import { MCollisionWalls } from '@core/modules/collision/MCollisionWalls';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import { Projectile } from '@game/objects/projectile/projectile';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import { drawCircle } from '@utils/canvas/drawCircle';

export interface EnemyShooterProjectileParams {
  startPosition: Position;
  velocity: Velocity;
}

export class EnemyShooterProjectile extends Projectile {
  private readonly _MCollisionSaveZone: MCollisionSaveZone;
  private readonly _MCollisionWalls: MCollisionWalls;
  private readonly _MCollisionPlayer: MCollisionPlayer;

  constructor(params: EnemyShooterProjectileParams) {
    super({
      startPosition: params.startPosition,
      velocity: params.velocity,
      radius: ENEMYSHOOTERCONFIG.radius / 1.6,
      color: ENEMYSHOOTERCONFIG.color.clone(),
    });

    this._MCollisionSaveZone = new MCollisionSaveZone({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: this.onCollisionWithSaveZone.bind(this),
    });

    this._MCollisionWalls = new MCollisionWalls({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: this.onCollisionWithWalls.bind(this),
    });

    this._MCollisionPlayer = new MCollisionPlayer({
      object: this,
      onCollision: this.onCollisionWithPlayer.bind(this),
    });
  }

  public override afterUpdate(): void {
    this._MCollisionPlayer.afterUpdate();
    this._MCollisionSaveZone.afterUpdate();
    this._MCollisionWalls.afterUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);
    drawCircle(ctx, {
      position: this.position,
      radius: this.radius,
      stroke: {
        width: ENEMYCONFIG.strokeWidth / 2,
        color: ENEMYCONFIG.strokeColor.clone(),
      },
    });
  }

  private onCollisionWithSaveZone(): void {
    this.delete();
  }

  private onCollisionWithWalls(): void {
    this.delete();
  }

  private onCollisionWithPlayer(player: CharacterBase): void {
    this.delete();
    player.die();
  }
}
