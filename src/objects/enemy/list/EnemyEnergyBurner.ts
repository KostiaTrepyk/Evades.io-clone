import { GameObject } from '../../../core/common/GameObject';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';
import { ENERGYBURNERENEMYCONFIG } from '../../../configs/enemies/energyBurnerEnemy.config';

export class EnemyEnergyBurner extends Enemy {
  private radius: number;
  private energySteals: number;

  constructor(startPosition: Position, velocity: Velocity) {
    super(
      startPosition,
      ENERGYBURNERENEMYCONFIG.size,
      velocity,
      ENERGYBURNERENEMYCONFIG.color
    );
    this.radius = ENERGYBURNERENEMYCONFIG.auraRadius;
    this.energySteals = ENERGYBURNERENEMYCONFIG.energySteals;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    const player = gameObjectManager.player;

    if (!player) return;

    const aura = new GameObject(this.position, {
      shape: 'circle',
      size: this.radius * 2,
    });

    if (doItemsCollide(player, aura).doesCollide === true) {
      this.stealEnergy(player, deltaTime);
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);

    ctx.beginPath();
    ctx.fillStyle = ENERGYBURNERENEMYCONFIG.auraColor.toString();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 360);
    ctx.fill();
  }

  private stealEnergy(player: Character, deltaTime: number): void {
    player.characteristics.energy.current = Math.max(
      0,
      player.characteristics.energy.current - this.energySteals * deltaTime
    );
  }
}
