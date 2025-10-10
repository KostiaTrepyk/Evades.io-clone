import { GameObject } from '../../core/common/GameObject';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';
import { Velocity } from '../../core/types/Velocity';
import { Position } from '../../core/types/Position';
import { speedPerPoint } from '../../consts/consts';

export interface ProjectileParams {
  startPosition: Position;
  size: number;
  velocity: Velocity;
  color: HSLA;
}

export class Projectile extends GameObject<CircleShape> {
  public velocity: Velocity;
  private color: HSLA;

  constructor(params: ProjectileParams) {
    const { startPosition, size, velocity, color } = params;

    super(startPosition, { shape: 'circle', size: size });

    this.velocity = velocity;
    this.color = color;
  }

  public override onUpdate(deltaTime: number): void {
    this.position.x += this.velocity.x * speedPerPoint * deltaTime;
    this.position.y += this.velocity.y * speedPerPoint * deltaTime;
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, {
      position: this.position,
      size: this.objectModel.size,
      fill: { color: this.color },
    });
  }
}
