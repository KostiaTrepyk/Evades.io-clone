import type { CharacterBase } from '../characterBase/characterBase';

import { GAMECONFIG } from '@config/game.config';
import { RectangleObject } from '@core/common/RectangleObject/RectangleObject';
import { MCollisionPlayer } from '@modules/collision/MCollisionPlayer';
import type { Position } from '@shared-types/Position';
import { drawRectangle } from '@utils/canvas/drawRectangle';
import { HSLA } from '@utils/hsla';

export interface PortalParams {
  startPosition: Position;
  size: { width: number; height: number };
  onEnter: (player: CharacterBase) => void;
}

export class Portal extends RectangleObject {
  public override renderId: number = GAMECONFIG.renderingOrder.portal;

  private readonly _onEnter: (player: CharacterBase) => void;
  private readonly _MCollisionPlayer: MCollisionPlayer;

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

  private onCollisionWithPlayer(player: CharacterBase): void {
    this._onEnter(player);
  }
}
