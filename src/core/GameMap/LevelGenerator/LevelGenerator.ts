import { EnemyShooter } from '../../../objects/enemy/list/EnemyShooter/EnemyShooter';
import { Portal } from '../../../objects/portal/portal';
import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { gameObjectManager, renderer } from '../../global';
import { gameMap } from '../Configuration/GameMapConfiguration';
import { createCommonEnemy } from './create/createCommonEnemy';
import { createEnemyBorder } from './create/createEnemyBorder';
import { createEnemyEnergyBurner } from './create/createEnemyEnergyBurner';
import { createEnemySpeedReduction } from './create/createEnemySpeedReduction';
import { createPointOrbs } from './create/createPointOrbs';
import {
  CommonEnemyOptions,
  EnemyBorderOptions,
  EnemyEnergyBurnerOptions,
  EnemySpeedReductionOptions,
  EnemyTypes,
} from './types';

export const saveZoneWidth = 300;

export interface GenerateLevelOptions {
  enemies: (
    | CommonEnemyOptions
    | EnemyEnergyBurnerOptions
    | EnemySpeedReductionOptions
    | EnemyBorderOptions
  )[];
  pointOrbCount: number;
  playerPosition?: 'start' | 'end';
  portals: {
    prevLevel?: boolean;
    nextLevel?: boolean;
    prevTunnel?: boolean;
    nextTunnel?: boolean;
  };
}

export function generateLevel({
  enemies,
  pointOrbCount,
  playerPosition = 'start',
  portals,
}: GenerateLevelOptions) {
  clearLevel();

  // DELETE ME --- Only for tests
  const e = new EnemyShooter({
    position: { x: 1500, y: 300 },
    velocity: { x: 5, y: 1 },
    projectileSpeed: 17,
    shootDistance: 900,
  });
  e.init();
  // DELETE ME --- Only for tests

  // Player position
  if (gameObjectManager.player) {
    const player = gameObjectManager.player;
    if (playerPosition === 'start') {
      player.position.x = player.objectModel.size / 2 + 50;
    } else if (playerPosition === 'end') {
      player.position.x =
        renderer._canvasSize.x - player.objectModel.size / 2 - 50;
    }
    player.position.y = renderer.canvasSize.y / 2;
  }

  // Create SaveZone
  const saveZoneStart = new SaveZone(
    { x: saveZoneWidth / 2, y: renderer._canvasSize.y / 2 },
    { x: saveZoneWidth, y: renderer._canvasSize.y }
  );
  const saveZoneEnd = new SaveZone(
    {
      x: renderer._canvasSize.x - saveZoneWidth / 2,
      y: renderer._canvasSize.y / 2,
    },
    { x: saveZoneWidth, y: renderer._canvasSize.y }
  );
  saveZoneStart.init();
  saveZoneEnd.init();

  // Create Portals
  if (portals.prevLevel) {
    const portalToPrevLevel = new Portal(
      { x: 25, y: renderer._canvasSize.y / 2 },
      { x: 50, y: renderer._canvasSize.y },
      () => gameMap.prevLevel()
    );
    portalToPrevLevel.init();
  }
  if (portals.nextLevel) {
    const portalToNextLevel = new Portal(
      {
        x: renderer._canvasSize.x - 25,
        y: renderer._canvasSize.y / 2,
      },
      { x: 50, y: renderer._canvasSize.y },
      () => gameMap.nextLevel()
    );
    portalToNextLevel.init();
  }
  if (portals.prevTunnel) {
    const portalToPrevTunnel = new Portal(
      {
        x: 150,
        y: 25,
      },
      { x: 300, y: 50 },
      () => gameMap.prevTunnel()
    );
    portalToPrevTunnel.init();
  }
  if (portals.nextTunnel) {
    const portalToNextTunnel = new Portal(
      {
        x: 150,
        y: renderer.canvasSize.y - 25,
      },
      { x: 300, y: 50 },
      () => gameMap.nextTunnel()
    );
    portalToNextTunnel.init();
  }

  // Create enemies
  enemies.forEach((enemyTypeOptions) => {
    switch (enemyTypeOptions.type) {
      case EnemyTypes.CommonEnemy:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const commonEnemy = createCommonEnemy(enemyTypeOptions);
          commonEnemy.init();
        });
        break;

      case EnemyTypes.EnemyEnergyBurner:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const enemyEnergyBurner = createEnemyEnergyBurner(
            enemyTypeOptions.speed
          );
          enemyEnergyBurner.init();
        });
        break;

      case EnemyTypes.EnemySpeedReduction:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const enemySpeedReduction = createEnemySpeedReduction(
            enemyTypeOptions.speed
          );
          enemySpeedReduction.init();
        });
        break;

      case EnemyTypes.EnemyBorder:
        Array.from({ length: enemyTypeOptions.count }).forEach((_, i) => {
          const enemySpeedReduction = createEnemyBorder({
            speed: enemyTypeOptions.speed,
            count: enemyTypeOptions.count,
            order: i,
          });
          enemySpeedReduction.init();
        });
        break;

      default:
        throw new Error('Invalid enemy type');
    }
  });

  // Create pointOrbs
  createPointOrbs(pointOrbCount);
}

function clearLevel() {
  gameObjectManager.enemies.forEach((e) => e.delete());
  gameObjectManager.pointOrbs.forEach((p) => p.delete());
  gameObjectManager.saveZones.forEach((s) => s.delete());
  gameObjectManager.portals.forEach((s) => s.delete());
  gameObjectManager.projectiles.forEach((p) => p.delete());
}
