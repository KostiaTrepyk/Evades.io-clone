import { ENEMYSPEEDREDUCTIONCONFIG } from '../../../configs/enemies/enemySpeedReductionconfig';
import { GameObject } from '../../../core/common/GameObject/GameObject';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Velocity } from '../../../core/types/Velocity';
import { drawCircle } from '../../../core/utils/canvas/drawCircle';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { Character } from '../../character/character';
import { Enemy } from '../enemy';

interface EnemySpeedReductionParams {
  position: Position;
  velocity: Velocity;
}

export class EnemySpeedReduction extends Enemy {
  private _enemySpeedReductionEffectId: Symbol = Symbol(
    'EnemySpeedReduction aura'
  );

  constructor(params: EnemySpeedReductionParams) {
    super({
      ...params,
      size: ENEMYSPEEDREDUCTIONCONFIG.radius,
      color: ENEMYSPEEDREDUCTIONCONFIG.color,
    });
  }

  public override onUpdate(): void {
    super.onUpdate();

    const player = gameObjectManager.player;
    if (player === undefined) return;

    const size = ENEMYSPEEDREDUCTIONCONFIG.auraRadius * 2;
    const scale = this.EnemyStatus.sizeScale;

    const aura = new GameObject(this.position, {
      shape: 'circle',
      radius: size * scale,
    });

    const { doesCollide } = doItemsCollide(aura, player);

    if (doesCollide === true) this.applySpeedReductionEffect(player);
    else this.removeSpeedReductionEffect(player);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    const size = ENEMYSPEEDREDUCTIONCONFIG.auraRadius * 2;
    const scale = this.EnemyStatus.sizeScale;
    drawCircle(ctx, {
      position: this.position,
      radius: size * scale,
      fill: { color: ENEMYSPEEDREDUCTIONCONFIG.auraColor },
    });

    super.onRender(ctx);
  }

  public override delete(): void {
    const player = gameObjectManager.player;
    if (player) this.removeSpeedReductionEffect(player);

    super.delete();
  }

  private applySpeedReductionEffect(player: Character): void {
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

  private removeSpeedReductionEffect(player: Character): void {
    player.characteristics.MStatus.removeStatus(
      this._enemySpeedReductionEffectId
    );
  }
}
