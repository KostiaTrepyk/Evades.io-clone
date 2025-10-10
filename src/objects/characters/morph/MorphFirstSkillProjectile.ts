import { time } from '../../../core/global';
import { MCollisionEnemy } from '../../../core/modules/collision/MCollisionEnemy';
import { MCollisionWalls } from '../../../core/modules/collision/MCollisionWalls';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { HSLA } from '../../../core/utils/hsla';
import { Enemy } from '../../enemy/enemy';
import { Projectile } from '../../projectile/projectile';
import { Morph } from './morph';

export interface MorphFirstSkillProjectileParams {
  statusId: Symbol;
  player: Morph;
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class MorphFirstSkillProjectile extends Projectile {
  private statusId: Symbol;
  private player: Morph;

  private MCollisionEnemy: MCollisionEnemy;
  private MCollisionWalls: MCollisionWalls;

  constructor(params: MorphFirstSkillProjectileParams) {
    const { player, startPosition, size, velocity, color, statusId } = params;
    super({ startPosition, size, velocity, color });

    this.statusId = statusId;

    this.player = player;
    this.MCollisionEnemy = new MCollisionEnemy({
      object: this,
      onCollision: (enemy) => {
        this.collisionWithEnemy(enemy, this);
      },
    });

    this.MCollisionWalls = new MCollisionWalls({
      object: this,
      collisionType: 'onlyAfterCollision',
      onCollision: () => {
        this.delete();
      },
    });
  }

  public override afterUpdate(deltaTime: number): void {
    this.MCollisionEnemy.afterUpdate(deltaTime);
    this.MCollisionWalls.afterUpdate(deltaTime);
  }

  private collisionWithEnemy(enemy: Enemy, projectile: Projectile): void {
    const affectedEnemy = this.player.enemyEffectedByFirstSkill.find(
      ({ enemy: effectedEnemy }) => effectedEnemy === enemy
    );

    // Если существует то обновляем время, если нет тогда делаем push
    if (affectedEnemy !== undefined) {
      affectedEnemy.timestamp = time.timestamp;
    } else {
      this.player.enemyEffectedByFirstSkill.push({
        timestamp: time.timestamp,
        enemy,
      });
    }

    // FIX ME Не правильно изменяет цвет
    const newEnemyColor = enemy.defaultColor.clone();
    newEnemyColor.setHue = 110;
    newEnemyColor.setSaturation = 50;
    newEnemyColor.setLightness = 50;
    newEnemyColor.setAlpha = 0.8;

    enemy.currentColor = newEnemyColor;

    const newVelocity = enemy.velocity;

    // Изменяет направление полёта врага.
    if (projectile.velocity.x > 0) newVelocity.x = Math.abs(enemy.velocity.x);
    else if (projectile.velocity.x < 0)
      newVelocity.x = -Math.abs(enemy.velocity.x);

    if (projectile.velocity.y > 0) newVelocity.y = Math.abs(enemy.velocity.y);
    else if (projectile.velocity.y < 0)
      newVelocity.y = -Math.abs(enemy.velocity.y);

    enemy.setVelocity = newVelocity;
  }
}
