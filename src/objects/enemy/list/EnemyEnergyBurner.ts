import { GameObject } from '../../../core/common/GameObject';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';
import { ENERGYBURNERENEMYCONFIG } from '../../../configs/enemies/energyBurnerEnemy.config';

export interface EnemyEnergyBurnerParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyEnergyBurner extends Enemy {
  private radius: number;
  private energySteals: number;

  constructor(params: EnemyEnergyBurnerParams) {
    const { position, velocity } = params;
    super({
      position,
      size: ENERGYBURNERENEMYCONFIG.size,
      velocity,
      color: { hue: ENERGYBURNERENEMYCONFIG.color.hue },
    });
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
    const playerCurrentEnergy = player.characteristics.getEnergy.current;

    // FIX ME Не забирает энергию до 0
    player.characteristics.removeEnergy(
      playerCurrentEnergy - this.energySteals * deltaTime
    );
  }
}
