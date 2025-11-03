import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { HSLA } from '../../core/utils/hsla';
import { Velocity } from '../../core/types/Velocity';
import { Position } from '../../core/types/Position';
import { speedPerPoint } from '../../consts/consts';
import { time } from '../../core/global';
import { CircleObject } from '../../core/common/CircleObject/CircleObject';

export interface ProjectileParams {
  startPosition: Position;
  radius: number;
  velocity: Velocity;
  color: HSLA;
}

export class Projectile extends CircleObject {
  public override renderId: number = 6;

  public velocity: Velocity;
  private _color: HSLA;

  constructor(params: ProjectileParams) {
    const { startPosition, radius, velocity, color } = params;

    super(startPosition, radius);

    this.velocity = velocity;
    this._color = color;
  }

  public override onUpdate(): void {
    super.onUpdate?.();
    this.position.x += this.velocity.x * speedPerPoint * time.deltaTime;
    this.position.y += this.velocity.y * speedPerPoint * time.deltaTime;
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender?.(ctx);
    drawCircle(ctx, {
      position: this.position,
      radius: this.radius,
      fill: { color: this._color },
    });
  }
}
