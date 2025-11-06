import type { CharacterBase } from '../characterBase/characterBase';
import { EnemyBase } from '../enemyBase/enemyBase';

import { ENEMYSPEEDREDUCTIONCONFIG } from '@config/enemies/enemySpeedReductionconfig';
import { GameCollision } from '@core/collision/GameCollision';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { gameObjectManager } from '@core/global';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import { drawCircle } from '@utils/canvas/drawCircle';

interface EnemySpeedReductionParams {
  position: Position;
  velocity: Velocity;
}

export class EnemySpeedReduction extends EnemyBase {
  private _enemySpeedReductionEffectId: Symbol = Symbol('EnemySpeedReduction aura');

  constructor(params: EnemySpeedReductionParams) {
    super({
      ...params,
      radius: ENEMYSPEEDREDUCTIONCONFIG.radius,
      color: ENEMYSPEEDREDUCTIONCONFIG.color,
    });
  }

  public override onUpdate(): void {
    super.onUpdate();

    const player = gameObjectManager.player;
    if (player === undefined) return;

    const scale = this.EnemyStatus.sizeScale;

    const aura = new CircleObject(this.position, ENEMYSPEEDREDUCTIONCONFIG.auraRadius * scale);

    const { doesCollide } = GameCollision.checkCollisions(aura, player);

    if (doesCollide === true) this.applySpeedReductionEffect(player);
    else this.removeSpeedReductionEffect(player);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    const scale = this.EnemyStatus.sizeScale;
    drawCircle(ctx, {
      position: this.position,
      radius: ENEMYSPEEDREDUCTIONCONFIG.auraRadius * scale,
      fill: { color: ENEMYSPEEDREDUCTIONCONFIG.auraColor },
    });

    super.onRender(ctx);
  }

  public override delete(): void {
    const player = gameObjectManager.player;
    if (player) this.removeSpeedReductionEffect(player);

    super.delete();
  }

  private applySpeedReductionEffect(player: CharacterBase): void {
    player.characteristics.MStatus.applyStatus({
      id: this._enemySpeedReductionEffectId,
      name: 'speedReduction',
      effects: {
        speed: {
          type: 'percentage',
          value: ENEMYSPEEDREDUCTIONCONFIG.slowRatio,
        },
      },
    });
  }

  private removeSpeedReductionEffect(player: CharacterBase): void {
    player.characteristics.MStatus.removeStatus(this._enemySpeedReductionEffectId);
  }
}
