import { PointOrb } from '../../../objects/pointOrb/PointOrb';
import { Portal } from '../../../objects/portal/portal';
import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { gameObjectManager, renderer } from '../../global';
import { getRandomPosition } from '../../utils/other/getRandomPosition';
import { gameMap } from '../Configuration/GameMapConfiguration';
import { createCommonEnemy } from './create/createCommonEnemy';
import { createEnemyEnergyBurner } from './create/createEnemyEnergyBurner';
import { createEnemySpeedReduction } from './create/createEnemySpeedReduction';
import {
  CommonEnemyOptions,
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
  saveZoneStart.create();
  saveZoneEnd.create();

  // Create Portals
  if (portals.prevLevel) {
    const portalToPrevLevel = new Portal(
      { x: 25, y: renderer._canvasSize.y / 2 },
      { x: 50, y: renderer._canvasSize.y },
      () => gameMap.prevLevel()
    );
    portalToPrevLevel.create();
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
    portalToNextLevel.create();
  }
  if (portals.prevTunnel) {
    const portalToPrevTunel = new Portal(
      {
        x: 150,
        y: 25,
      },
      { x: 300, y: 50 },
      () => gameMap.prevTunnel()
    );
    portalToPrevTunel.create();
  }
  if (portals.nextTunnel) {
    const portalToNextTunel = new Portal(
      {
        x: 150,
        y: renderer.canvasSize.y - 25,
      },
      { x: 300, y: 50 },
      () => gameMap.nextTunnel()
    );
    portalToNextTunel.create();
  }

  // Create enemies
  enemies.forEach((enemyTypeOptions) => {
    switch (enemyTypeOptions.type) {
      case EnemyTypes.CommonEnemy:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const commonEnemy = createCommonEnemy(enemyTypeOptions);
          commonEnemy.create();
        });
        break;

      case EnemyTypes.EnemyEnergyBurner:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const enemyEnergyBurner = createEnemyEnergyBurner(
            enemyTypeOptions.speed
          );
          enemyEnergyBurner.create();
        });
        break;

      case EnemyTypes.EnemySpeedReduction:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const enemySpeedReduction = createEnemySpeedReduction(
            enemyTypeOptions.speed
          );
          enemySpeedReduction.create();
        });
        break;

      default:
        throw new Error('Invalid enemy type');
    }
  });

  // Create pointOrbs
  Array.from({ length: pointOrbCount }).forEach(() => {
    const pointOrb = new PointOrb(
      getRandomPosition({
        minX: saveZoneWidth + 50,
        maxX: renderer._canvasSize.x - saveZoneWidth - 50,
        minY: 50,
        maxY: renderer._canvasSize.y - 50,
      })
    );
    pointOrb.create();
  });
}

function clearLevel() {
  gameObjectManager.enemies.forEach((e) => e.delete());
  gameObjectManager.pointOrbs.forEach((p) => p.delete());
  gameObjectManager.saveZones.forEach((s) => s.delete());
  gameObjectManager.portals.forEach((s) => s.delete());
  gameObjectManager.projectiles.forEach((p) => p.delete());
}
