import { GameObject } from '../../../core/common/GameObject';
import { doItemsIntersect } from '../../../core/utils/collision/doItemsIntersect';
import { gameObjectManager } from '../../../core/global';
import { HSLA } from '../../../core/utils/hsla';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';

export class EnemyEnergyBurner extends Enemy {
  private radius: number;
  private energySteals: number;

  constructor(startPosition: Position, velocity: Velocity) {
    super(startPosition, 50, velocity);
    this.radius = 200;
    this.energySteals = 12;
    //FIX ME из за readonly в defaultColor не могу поставить цвет
    // this.defaultColor = new HSLA(235, 100, 60, 1);
    this.currentColor = new HSLA(235, 100, 60, 1);
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    const player = gameObjectManager.player;

    if (!player) return;

    const a = new GameObject(this.position, {
      shape: 'circle',
      size: this.radius * 2,
    });

    if (doItemsIntersect(player, a).doesIntersect === true) {
      this.stealEnergy(player, deltaTime);
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);

    ctx.beginPath();
    ctx.fillStyle = '#05f3';
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
