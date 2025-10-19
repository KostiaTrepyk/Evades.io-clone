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
  private MCollisionSaveZone: MCollisionSaveZone;
  private MCollisionWalls: MCollisionWalls;
  private MCollisionPlayer: MCollisionPlayer;

  constructor(params: EnemyShooterProjectileParams) {
    super({
      startPosition: params.startPosition,
      velocity: params.velocity,
      size: ENEMYSHOOTERCONFIG.size / 1.6,
      color: ENEMYSHOOTERCONFIG.color.clone(),
    });

    this.MCollisionSaveZone = new MCollisionSaveZone({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: this.onCollisionWithSaveZone.bind(this),
    });

    this.MCollisionWalls = new MCollisionWalls({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: this.onCollisionWithWalls.bind(this),
    });

    this.MCollisionPlayer = new MCollisionPlayer({
      object: this,
      onCollision: this.onCollisionWithPlayer.bind(this),
    });
  }

  public override afterUpdate(deltaTime: number): void {
    this.MCollisionPlayer.afterUpdate(deltaTime);
    this.MCollisionSaveZone.afterUpdate(deltaTime);
    this.MCollisionWalls.afterUpdate(deltaTime);
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
