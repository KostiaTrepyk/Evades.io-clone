import { GameObject } from '../../core/common/GameObject/GameObject';
import { Position } from '../../core/types/Position';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';
import { HSLA } from '../../core/utils/hsla';
import { MCollisionPlayer } from '../../core/modules/collision/MCollisionPlayer';
import { Character } from '../character/character';

interface PortalParams {
  startPosition: Position;
  size: { x: number; y: number };
  onEnter: () => void;
}

export class Portal extends GameObject<'rectangle'> {
  private onEnter: () => void;
  private MCollisionPlayer: MCollisionPlayer;

  constructor(params: PortalParams) {
    super(params.startPosition, { shape: 'rectangle', size: params.size });
    this.onEnter = params.onEnter;

    this.MCollisionPlayer = new MCollisionPlayer({
      object: this,
      onCollision: this.onCollisionWithPlayer.bind(this),
    });
  }

  public override afterUpdate(deltaTime: number): void {
    this.MCollisionPlayer.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawRectangle(ctx, {
      position: this.position,
      size: { height: this.objectModel.size.y, width: this.objectModel.size.x },
      fill: { color: new HSLA(180, 100, 50, 0.3) },
    });
  }

  private onCollisionWithPlayer(player: Character): void {
    this.onEnter();
  }
}
