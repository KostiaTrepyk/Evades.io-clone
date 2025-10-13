import { ENEMYSPEEDREDUCTIONCONFIG } from '../../../configs/enemies/enemySpeedReductionconfig';
import { GameObject } from '../../../core/common/GameObject';
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
  private enemySpeedReductionEffectId: Symbol = Symbol(
    'EnemySpeedReduction aura'
  );

  constructor(params: EnemySpeedReductionParams) {
    super({
      ...params,
      size: ENEMYSPEEDREDUCTIONCONFIG.size,
      color: { hue: ENEMYSPEEDREDUCTIONCONFIG.color.hue },
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    const player = gameObjectManager.player;
    if (player === undefined) return;

    const aura = new GameObject(this.position, {
      shape: 'circle',
      size: ENEMYSPEEDREDUCTIONCONFIG.auraRadius * 2,
    });

    const { doesCollide } = doItemsCollide(aura, player);

    if (doesCollide === true) this.applySpeedReductionEffect(player);
    else this.removeSpeedReductionEffect(player);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, {
      position: this.position,
      size: ENEMYSPEEDREDUCTIONCONFIG.auraRadius * 2,
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
      id: this.enemySpeedReductionEffectId,
      name: 'speedReduction',
      effects: { speed: { type: 'percentage', value: 0.5 } },
    });
  }

  private removeSpeedReductionEffect(player: Character): void {
    player.characteristics.MStatus.removeStatus(
      this.enemySpeedReductionEffectId
    );
  }
}
