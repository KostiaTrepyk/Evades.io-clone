import type { Velocity } from '@shared-types/Velocity';
import type { MoveDirection } from '@shared-types/moveDirection';

/* Это получается что мы берём два вектора: вектор направления игрока и его перпендикуляр вправо.
  1)  Вектор направления игрока умножаем на ratio.x   <- это движение вперёд
  2)  Перпендикуляр умножаем на ratio.y   <- это движение вправо
  3)  Складываем оба вектора и получаем x, y но полученный вектор не нормализован.
  4)  Считаем длину вектора.
  5)  Делим x, y на длину вектора (длина вектора должна быть равна 1 что-бы не искажать скорость. 
      Если будет равна например 2, тогда скорость будет в два раза выше).
*/
/** Compute projectile velocity in world coords from local ratio */
export function determineProjectileTrajectory(
  moveDirection: MoveDirection,
  ratio: { x: number; y: number },
  speed: number,
): Velocity {
  // right perpendicular
  const perp = { x: -moveDirection.y, y: moveDirection.x };

  // local -> world combination
  const worldX = moveDirection.x * ratio.x + perp.x * ratio.y;
  const worldY = moveDirection.y * ratio.x + perp.y * ratio.y;

  // normalize world direction to unit vector.
  const worldLen = Math.hypot(worldX, worldY) || 1;
  const nx = worldX / worldLen;
  const ny = worldY / worldLen;

  return { x: nx * speed, y: ny * speed };
}
