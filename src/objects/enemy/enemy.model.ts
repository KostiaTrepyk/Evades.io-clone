import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { ENEMYCONFIG } from '../../configs/enemies/enemy.config';

export function RenderEnemyModel(
  ctx: CanvasRenderingContext2D,
  position: Position,
  size: number,
  color: HSLA
) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color.toString();
  ctx.strokeStyle = ENEMYCONFIG.strokeColor.toString();
  ctx.lineWidth = ENEMYCONFIG.strokeWidth;
  ctx.fill();
  ctx.stroke();
}
