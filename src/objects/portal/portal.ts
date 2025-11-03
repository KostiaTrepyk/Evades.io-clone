import { Position } from '../../core/types/Position';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';
import { HSLA } from '../../core/utils/hsla';
import { MCollisionPlayer } from '../../core/modules/collision/MCollisionPlayer';
import { Character } from '../character/character';
import { RectangleObject } from '../../core/common/GameObject/RectangleObject';

export interface PortalParams {
  startPosition: Position;
  size: { width: number; height: number };
  onEnter: (player: Character) => void;
}

export class Portal extends RectangleObject {
  public override renderId: number = 1;

  private _onEnter: (player: Character) => void;
  private _MCollisionPlayer: MCollisionPlayer;

  constructor(params: PortalParams) {
    super(params.startPosition, params.size);
    this._onEnter = params.onEnter;

    this._MCollisionPlayer = new MCollisionPlayer({
      object: this,
      onCollision: this.onCollisionWithPlayer.bind(this),
    });
  }

  public override afterUpdate(): void {
    this._MCollisionPlayer.afterUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawRectangle(ctx, {
      position: this.position,
      size: { height: this.size.height, width: this.size.width },
      fill: { color: new HSLA(180, 100, 50, 0.3) },
    });
  }

  private onCollisionWithPlayer(player: Character): void {
    this._onEnter(player);
  }
}
