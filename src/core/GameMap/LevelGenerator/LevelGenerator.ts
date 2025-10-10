import { enemyEnergyBurnerSize } from '../../../consts/enemies';
import { EnemyEnergyBurner } from '../../../objects/enemy/list/EnemyEnergyBurner';
import { PointOrb } from '../../../objects/pointOrb/PointOrb';
import { Portal } from '../../../objects/portal/portal';
import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { gameObjectManager, renderer } from '../../global';
import { gameMap } from '../Configuration/GameMapConfiguration';
import { createCommonEnemy } from './create/createCommonEnemy';
import { getRandomPosition, getRandomVelocity } from './helpers/helpers';
import {
  CommonEnemyOptions,
  EnemyEnergyBurnerOptions,
  EnemyTypes,
} from './types';

export const saveZoneWidth = 300;

export interface GenerateLevelOptions {
  enemies: (CommonEnemyOptions | EnemyEnergyBurnerOptions)[];
  pointOrbCount: number;
  playerPosition?: 'start' | 'end';
  portals: {
    prevLevel?: boolean;
    nextLevel?: boolean;
    prevTunel?: boolean;
    nextTunel?: boolean;
  };
}

export function generateLevel({
  enemies: enemyTypes,
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
  if (portals.prevTunel) {
    const portalToPrevTunel = new Portal(
      {
        x: 150,
        y: 25,
      },
      { x: 300, y: 50 },
      () => gameMap.prevTunel()
    );
    portalToPrevTunel.create();
  }
  if (portals.nextTunel) {
    const portalToNextTunel = new Portal(
      {
        x: 150,
        y: renderer.canvasSize.y - 25,
      },
      { x: 300, y: 50 },
      () => gameMap.nextTunel()
    );
    portalToNextTunel.create();
  }

  // Create enemies
  enemyTypes.forEach((enemyTypeOptions) => {
    switch (true) {
      case enemyTypeOptions.type === EnemyTypes.CommonEnemy:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          createCommonEnemy(enemyTypeOptions);
        });
        break;

      case enemyTypeOptions.type === EnemyTypes.EnemyEnergyBurner:
        Array.from({ length: enemyTypeOptions.count }).forEach(() => {
          const newEnemyEnergyBurner = new EnemyEnergyBurner(
            getRandomPosition({
              minX: saveZoneWidth + (enemyEnergyBurnerSize + 2),
              maxX:
                renderer._canvasSize.x -
                saveZoneWidth -
                (enemyEnergyBurnerSize + 2),
              minY: enemyEnergyBurnerSize + 2,
              maxY: renderer._canvasSize.y - (enemyEnergyBurnerSize + 2),
            }),
            getRandomVelocity(enemyTypeOptions.speed)
          );
          newEnemyEnergyBurner.create();
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
  gameObjectManager.enemies = [];
  gameObjectManager.pointOrbs = [];
  gameObjectManager.saveZones = [];
  gameObjectManager.portals = [];
}
