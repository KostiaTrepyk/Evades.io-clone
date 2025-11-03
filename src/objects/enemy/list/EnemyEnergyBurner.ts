import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';
import { ENERGYBURNERENEMYCONFIG } from '../../../configs/enemies/energyBurnerEnemy.config';
import { drawCircle } from '../../../core/utils/canvas/drawCircle';
import { CircleObject } from '../../../core/common/CircleObject/CircleObject';

export interface EnemyEnergyBurnerParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyEnergyBurner extends Enemy {
  private _enemyEnergyBurnerEffectId: Symbol = Symbol(
    'EnemyEnergyBurnerEffectId aura'
  );

  constructor(params: EnemyEnergyBurnerParams) {
    const { position, velocity } = params;
    super({
      position,
      radius: ENERGYBURNERENEMYCONFIG.radius,
      velocity,
      color: ENERGYBURNERENEMYCONFIG.color,
    });
  }

  public override onUpdate(): void {
    super.onUpdate();

    const player = gameObjectManager.player;
    if (player === undefined) return;

    const scale = this.EnemyStatus.sizeScale;

    const aura = new CircleObject(
      this.position,
      ENERGYBURNERENEMYCONFIG.auraRadius * scale
    );

    const { doesCollide } = doItemsCollide(player, aura);

    if (doesCollide === true) this.applyStealEnergyEffect(player);
    else this.removeStealEnergyEffect(player);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    const scale = this.EnemyStatus.sizeScale;
    drawCircle(ctx, {
      position: this.position,
      radius: ENERGYBURNERENEMYCONFIG.auraRadius * scale,
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
      id: this._enemyEnergyBurnerEffectId,
      name: 'energyRegenerationReduction',
      effects: {
        energy: { regeneration: -ENERGYBURNERENEMYCONFIG.energySteals },
      },
    });
  }

  private removeStealEnergyEffect(player: Character): void {
    player.characteristics.MStatus.removeStatus(
      this._enemyEnergyBurnerEffectId
    );
  }
}
