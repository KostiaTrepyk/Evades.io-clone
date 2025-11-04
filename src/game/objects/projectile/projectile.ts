import { GAMECONFIG } from '@config/game.config';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { time } from '@core/global';
import type { Position } from '@shared-types/Position';
import type { Velocity } from '@shared-types/Velocity';
import { drawCircle } from '@utils/canvas/drawCircle';
import type { HSLA } from '@utils/hsla';

export interface ProjectileParams {
  startPosition: Position;
  radius: number;
  velocity: Velocity;
  color: HSLA;
}

export class Projectile extends CircleObject {
  public override renderId: number = 6;

  public velocity: Velocity;
  private readonly _color: HSLA;

  constructor(params: ProjectileParams) {
    const { startPosition, radius, velocity, color } = params;

    super(startPosition, radius);

    this.velocity = velocity;
    this._color = color;
  }

  public override onUpdate(): void {
    super.onUpdate?.();
    this.position.x += this.velocity.x * GAMECONFIG.speedPerPoint * time.deltaTime;
    this.position.y += this.velocity.y * GAMECONFIG.speedPerPoint * time.deltaTime;
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
