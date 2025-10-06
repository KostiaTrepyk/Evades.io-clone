import { GameObject } from '../../core/common/GameObject';
import { doItemsCollide } from '../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../core/global';
import { Position } from '../../core/types/Position';

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
    // Если существует игрок, проверяем на коллизию.
    if (gameObjectManager.player !== undefined) {
      const { doesCollide } = doItemsCollide(this, gameObjectManager.player);
      if (doesCollide === true) this.onEnter();
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'hsla(180, 100%, 50%, 0.3)';
    ctx.fillRect(
      this.position.x - this.objectModel.size.x / 2,
      this.position.y - this.objectModel.size.y / 2,
      this.objectModel.size.x,
      this.objectModel.size.y
    );
  }
}
