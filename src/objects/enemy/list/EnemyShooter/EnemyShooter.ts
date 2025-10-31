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
  shootDistance: number;
}

export class EnemyShooter extends Enemy {
  private _lastShootTimeStamp: number;
  /** Time in seconds */
  private _shootDeltaTime: number;
  private _projectileSpeed: number;
  private _shootDistance: number;

  constructor(params: EnemyShooterParams) {
    const { position, velocity, projectileSpeed, shootDistance } = params;

    super({
      position,
      size: ENEMYSHOOTERCONFIG.radius,
      velocity,
      color: ENEMYSHOOTERCONFIG.color.clone(),
    });

    const shootDeltaTime = 2;
    this._lastShootTimeStamp = -shootDeltaTime;
    this._shootDeltaTime = shootDeltaTime;

    this._projectileSpeed = projectileSpeed;
    this._shootDistance = shootDistance;
  }

  public override onUpdate(): void {
    super.onUpdate();

    const playerPosition = this.getPlayerPosition();

    // If player is not created.
    if (playerPosition === undefined) return;

    if (time.timestamp - this._lastShootTimeStamp >= this._shootDeltaTime) {
      // Check distance
      const deltaX = this.position.x - playerPosition.x;
      const deltaY = this.position.y - playerPosition.y;
      const distance = Math.abs(deltaX) + Math.abs(deltaY);
      if (distance > this._shootDistance) return;

      this._lastShootTimeStamp = time.timestamp;
      this.shoot(playerPosition);
    }
  }

  private shoot(playerPosition: Position): void {
    const projectile = this.createProjectile({
      startPosition: { x: this.position.x, y: this.position.y },
      playerPosition,
    });
    projectile.init();
    this._lastShootTimeStamp = time.timestamp;
  }

  private createProjectile(params: {
    startPosition: Position;
    playerPosition: Position;
  }): EnemyShooterProjectile {
    const projectile = new EnemyShooterProjectile({
      startPosition: params.startPosition,
      velocity: this.computeProjectileVelocity(
        params.playerPosition,
        this._projectileSpeed
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
