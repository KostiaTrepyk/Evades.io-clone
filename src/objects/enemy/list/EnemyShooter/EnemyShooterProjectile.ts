import { ENEMYCONFIG } from '../../../../configs/enemies/enemy.config';
import { ENEMYSHOOTERCONFIG } from '../../../../configs/enemies/enemyShooter.config';
import { MCollisionPlayer } from '../../../../core/modules/collision/MCollisionPlayer';
import { MCollisionSaveZone } from '../../../../core/modules/collision/MCollisionSaveZone';
import { MCollisionWalls } from '../../../../core/modules/collision/MCollisionWalls';
import { Position } from '../../../../core/types/Position';
import { Velocity } from '../../../../core/types/Velocity';
import { drawCircle } from '../../../../core/utils/canvas/drawCircle';
import { Character } from '../../../character/character';
import { Projectile } from '../../../projectile/projectile';

export interface EnemyShooterProjectileParams {
  startPosition: Position;
  velocity: Velocity;
}

export class EnemyShooterProjectile extends Projectile {
  private _MCollisionSaveZone: MCollisionSaveZone;
  private _MCollisionWalls: MCollisionWalls;
  private _MCollisionPlayer: MCollisionPlayer;

  constructor(params: EnemyShooterProjectileParams) {
    super({
      startPosition: params.startPosition,
      velocity: params.velocity,
      size: ENEMYSHOOTERCONFIG.size / 1.6,
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
      size: this.objectModel.size,
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

  private onCollisionWithPlayer(player: Character): void {
    this.delete();
    player.die();
  }
}
