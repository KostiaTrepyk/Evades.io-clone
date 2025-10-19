import { ENEMYSHOOTERCONFIG } from '../../../../configs/enemies/enemyShooter.config';
import { gameObjectManager, time } from '../../../../core/global';
import { Position } from '../../../../core/types/Position';
import { Velocity } from '../../../../core/types/Velocity';
import { Enemy } from '../../enemy';
import { EnemyShooterProjectile } from './EnemyShooterProjectile';

export interface EnemyShooterParams {
  position: Position;
  velocity: Velocity;
  projectileSpeed: number;
}

export class EnemyShooter extends Enemy {
  private lastShootTimeStamp: number;
  /** Time in seconds */
  private shootDeltaTime: number;

  private projectileSpeed: number;

  constructor(params: EnemyShooterParams) {
    const { position, velocity } = params;

    super({
      position,
      size: ENEMYSHOOTERCONFIG.size,
      velocity,
      color: ENEMYSHOOTERCONFIG.color.clone(),
    });

    const shootDeltaTime = 2;
    this.lastShootTimeStamp = -shootDeltaTime;
    this.shootDeltaTime = shootDeltaTime;

    this.projectileSpeed = params.projectileSpeed;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    if (
      time.timestamp - this.lastShootTimeStamp >=
      this.shootDeltaTime * 1000
    ) {
      this.lastShootTimeStamp = time.timestamp;
      this.shoot();
    }
  }

  private shoot(): void {
    const playerPosition = this.getPlayerPosition();

    // If player is not created.
    if (playerPosition === undefined) return;

    const projectile = this.createProjectile({
      startPosition: { x: this.position.x, y: this.position.y },
      playerPosition,
    });
    projectile.create();
    this.lastShootTimeStamp = time.timestamp;
  }

  private createProjectile(params: {
    startPosition: Position;
    playerPosition: Position;
  }): EnemyShooterProjectile {
    const projectile = new EnemyShooterProjectile({
      startPosition: params.startPosition,
      velocity: this.computeProjectileVelocity(
        params.playerPosition,
        this.projectileSpeed
      ),
    });

    return projectile;
  }

  // IMPROVE ME Можно улучшить если учитывать скорость и направление игрока.
  private computeProjectileVelocity(
    playerPosition: Position,
    speed: number
  ): Velocity {
    const positionFrom: Position = { x: this.position.x, y: this.position.y };

    // Calculating vector
    const vector: Velocity = {
      x: playerPosition.x - positionFrom.x,
      y: playerPosition.y - positionFrom.y,
    };

    // Vector normalization
    const hypot = Math.hypot(vector.x, vector.y);
    const normalizedVector: Velocity = {
      x: vector.x / hypot,
      y: vector.y / hypot,
    };

    const velocityX = normalizedVector.x * speed;
    const velocityY = normalizedVector.y * speed;

    return { x: velocityX, y: velocityY };
  }

  private getPlayerPosition(): Position | undefined {
    return gameObjectManager.player?.position;
  }
}
