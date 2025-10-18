import { GameObject } from '../../../core/common/GameObject/GameObject';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';
import { ENERGYBURNERENEMYCONFIG } from '../../../configs/enemies/energyBurnerEnemy.config';
import { drawCircle } from '../../../core/utils/canvas/drawCircle';

export interface EnemyEnergyBurnerParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyEnergyBurner extends Enemy {
  private enemyEnergyBurnerEffectId: Symbol = Symbol(
    'EnemyEnergyBurnerEffectId aura'
  );

  constructor(params: EnemyEnergyBurnerParams) {
    const { position, velocity } = params;
    super({
      position,
      size: ENERGYBURNERENEMYCONFIG.size,
      velocity,
      color: ENERGYBURNERENEMYCONFIG.color,
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    const player = gameObjectManager.player;
    if (player === undefined) return;

    const size = ENERGYBURNERENEMYCONFIG.auraRadius * 2;
    const scale = this.EnemyStatus.sizeScale;

    const aura = new GameObject(this.position, {
      shape: 'circle',
      size: size * scale,
    });

    const { doesCollide } = doItemsCollide(player, aura);

    if (doesCollide === true) this.applyStealEnergyEffect(player);
    else this.removeStealEnergyEffect(player);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    const size = ENERGYBURNERENEMYCONFIG.auraRadius * 2;
    const scale = this.EnemyStatus.sizeScale;
    drawCircle(ctx, {
      position: this.position,
      size: size * scale,
      fill: { color: ENERGYBURNERENEMYCONFIG.auraColor },
    });

    super.onRender(ctx);
  }

  public override delete(): void {
    const player = gameObjectManager.player;
    if (player) this.removeStealEnergyEffect(player);

    super.delete();
  }

  private applyStealEnergyEffect(player: Character): void {
    player.characteristics.MStatus.applyStatus({
      id: this.enemyEnergyBurnerEffectId,
      name: 'energyRegenerationReduction',
      effects: {
        energy: { regeneration: -ENERGYBURNERENEMYCONFIG.energySteals },
      },
    });
  }

  private removeStealEnergyEffect(player: Character): void {
    player.characteristics.MStatus.removeStatus(this.enemyEnergyBurnerEffectId);
  }
}
