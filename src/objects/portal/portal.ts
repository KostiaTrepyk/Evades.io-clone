import { GameObject } from '../../core/common/GameObject/GameObject';
import { doItemsCollide } from '../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../core/global';
import { Position } from '../../core/types/Position';
import { drawRectangle } from '../../core/utils/canvas/drawRectangle';
import { HSLA } from '../../core/utils/hsla';

export class Portal extends GameObject<'rectangle'> {
  private onEnter: () => void;

  constructor(
    startPosition: Position,
    size: { x: number; y: number },
    onEnter: () => void
  ) {
    super(startPosition, { shape: 'rectangle', size });
    this.onEnter = onEnter;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate?.(deltaTime);
    // Если существует игрок, проверяем на коллизию.
    if (gameObjectManager.player !== undefined) {
      const { doesCollide } = doItemsCollide(this, gameObjectManager.player);
      if (doesCollide === true) this.onEnter();
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawRectangle(ctx, {
      position: this.position,
      size: { height: this.objectModel.size.y, width: this.objectModel.size.x },
      fill: { color: new HSLA(180, 100, 50, 0.3) },
    });
  }
}
