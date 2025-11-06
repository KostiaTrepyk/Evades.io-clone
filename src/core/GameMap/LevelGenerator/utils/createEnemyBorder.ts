import type { GenerateLevelConfiguration } from '../LevelGenerator';

import { ENEMYBORDERCONFIG } from '@config/enemies/enemyBorder.config';
import { renderer } from '@core/global';
import { EnemyBorder } from '@game/objects/enemies/EnemyBorder';

/** Создаёт врага createEnemyBorder. В зависимости от количества этих врагов будет просчитываться их начальная позиция, так-как расстояние между врагами должно быть одинаковое.
 *  @argument params.speed - скорость врага которого создаём. В идеале скорость всех врагов данного типа на одном уровне должна быть одинаковая (Может быть разной, если так задумано).
 *  @argument params.count - количество врагов. От a.count и a.order зависит расчёт начальной позиции.
 *  @argument params.order - это номер врага которого создаём. Он может быть: 0 <= a.order < count.
 */
export function createEnemyBorder(params: {
  speed: number;
  count: number;
  order: number;
  saveZones: GenerateLevelConfiguration['saveZones'];
}): EnemyBorder {
  // FIX ME  WTF TYPE ERROR
  const radius = ENEMYBORDERCONFIG.radius + 0;

  const minX = params.saveZones.start.width + radius;
  const maxX = renderer.canvasSize.width - params.saveZones.end.width - radius;
  const minY = radius;
  const maxY = renderer.canvasSize.height - radius;

  const length = {
    x: maxX - minX,
    y: maxY - minY,
  };

  // 0 -> value
  const maxDistance = length.x * 2 + length.y * 2;

  const distancePerEnemy = maxDistance / params.count;

  let enemyDistance = distancePerEnemy * (params.order + 1);

  // FIX ME readability ?????
  let x = minX;
  let y = minY;
  let velocityX = 0;
  let velocityY = 0;

  if (enemyDistance < length.x) {
    x = enemyDistance + minX;
    y = minY;
    velocityX = params.speed;
    velocityY = 0;
  } else {
    enemyDistance -= length.x;

    if (enemyDistance < length.y) {
      x = maxX;
      y = enemyDistance + minY;
      velocityX = 0;
      velocityY = params.speed;
    } else {
      enemyDistance -= length.y;

      if (enemyDistance < length.x) {
        x = maxX - enemyDistance;
        y = maxY;
        velocityX = -params.speed;
        velocityY = 0;
      } else {
        enemyDistance -= length.x;

        x = minX;
        y = maxY - enemyDistance;
        velocityX = 0;
        velocityY = -params.speed;
      }
    }
  }

  return new EnemyBorder({
    position: { x, y },
    velocity: { x: velocityX, y: velocityY },
  });
}
