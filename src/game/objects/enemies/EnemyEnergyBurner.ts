import type { CharacterBase } from '../characterBase/characterBase';
import { EnemyBase } from '../enemyBase/enemyBase';

import { ENERGYBURNERENEMYCONFIG } from '@config/enemies/energyBurnerEnemy.config';
import { GameCollision } from '@core/collision/GameCollision';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { gameObjectManager } from '@core/global';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import { drawCircle } from '@utils/canvas/drawCircle';

export interface EnemyEnergyBurnerParams {
  position: Position;
  velocity: Velocity;
}

export class EnemyEnergyBurner extends EnemyBase {
  private _enemyEnergyBurnerEffectId: Symbol = Symbol('EnemyEnergyBurnerEffectId aura');

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
    const aura = new CircleObject(this.position, ENERGYBURNERENEMYCONFIG.auraRadius * scale);

    const { doesCollide } = GameCollision.checkCollisions(player, aura);

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

  private applyStealEnergyEffect(player: CharacterBase): void {
    player.characteristics.MStatus.applyStatus({
      id: this._enemyEnergyBurnerEffectId,
      name: 'energyRegenerationReduction',
      effects: {
        energy: { regeneration: -ENERGYBURNERENEMYCONFIG.energySteals },
      },
    });
  }

  private removeStealEnergyEffect(player: CharacterBase): void {
    player.characteristics.MStatus.removeStatus(this._enemyEnergyBurnerEffectId);
  }
}
