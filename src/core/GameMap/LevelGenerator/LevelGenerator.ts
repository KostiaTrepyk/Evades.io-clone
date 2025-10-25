import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { gameObjectManager, renderer } from '../../global';
import { gameMap } from '../../../configs/GameMap/GameMapConfiguration';
import { createCommonEnemy } from './utils/createCommonEnemy';
import { createEnemyBorder } from './utils/createEnemyBorder';
import { createEnemyEnergyBurner } from './utils/createEnemyEnergyBurner';
import { createEnemySpeedReduction } from './utils/createEnemySpeedReduction';
import { createPortal } from './utils/createPortal';
import { EnemyConfiguration, enemyTypes } from '../types';
import { createEnemyShooter } from './utils/createEnemyShooter';
import { getRandomPosition } from '../../utils/other/getRandomPosition';
import { PointOrb } from '../../../objects/pointOrb/PointOrb';
import { cellSize } from '../../../consts/consts';

export const saveZoneWidth = 300;

export interface GenerateLevelOptions {
  enemies: EnemyConfiguration[];
  pointOrbCount: number;
  playerPosition: 'start' | 'end';
  portals: {
    prevLevel?: boolean;
    nextLevel?: boolean;
    prevTunnel?: boolean;
    nextTunnel?: boolean;
  };
  level: number;
}

export class LevelGenerator {
  public generateLevel(params: GenerateLevelOptions): void {
    this.clearLevel();

    this.repositionPlayer(params.playerPosition);

    this.createSaveZones();
    this.createPortals(params.portals);
    this.createEnemies(params.enemies, params.level);
    this.createPointOrbs(params.pointOrbCount);
  }

  private repositionPlayer(
    playerPosition: GenerateLevelOptions['playerPosition']
  ): void {
    if (gameObjectManager.player) {
      const player = gameObjectManager.player;
      if (playerPosition === 'start') {
        player.position.x = player.objectModel.size / 2 + cellSize;
      } else if (playerPosition === 'end') {
        player.position.x =
          renderer._canvasSize.x - player.objectModel.size / 2 - cellSize;
      }
      player.position.y = renderer.canvasSize.y / 2;
    }
  }

  private createSaveZones(): void {
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
  }

  private createPortals(portals: GenerateLevelOptions['portals']): void {
    if (portals.prevLevel) {
      const portalToPrevLevel = createPortal({
        startPosition: { x: cellSize / 2, y: renderer._canvasSize.y / 2 },
        size: { x: cellSize, y: renderer._canvasSize.y },
        onEnter: () => gameMap.prevLevel(),
      });
      portalToPrevLevel.init();
    }
    if (portals.nextLevel) {
      const portalToNextLevel = createPortal({
        startPosition: {
          x: renderer._canvasSize.x - cellSize / 2,
          y: renderer._canvasSize.y / 2,
        },
        size: { x: cellSize, y: renderer._canvasSize.y },
        onEnter: () => gameMap.nextLevel(),
      });
      portalToNextLevel.init();
    }
    if (portals.prevTunnel) {
      const portalToPrevTunnel = createPortal({
        startPosition: { x: saveZoneWidth / 2, y: cellSize / 2 },
        size: { x: saveZoneWidth, y: cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToPrevTunnel.init();
    }
    if (portals.nextTunnel) {
      const portalToNextTunnel = createPortal({
        startPosition: {
          x: saveZoneWidth / 2,
          y: renderer.canvasSize.y - cellSize / 2,
        },
        size: { x: saveZoneWidth, y: cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToNextTunnel.init();
    }
  }

  private createEnemies(
    enemies: GenerateLevelOptions['enemies'],
    level: GenerateLevelOptions['level']
  ): void {
    enemies.forEach((enemyTypeOptions) => {
      switch (enemyTypeOptions.type) {
        case enemyTypes.CommonEnemy:
          let count = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          let speed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: count }).forEach(() => {
            const commonEnemy = createCommonEnemy({
              size: enemyTypeOptions.size,
              speed,
            });
            commonEnemy.init();
          });
          break;

        case enemyTypes.EnemyEnergyBurner:
          count = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          speed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: count }).forEach(() => {
            const enemyEnergyBurner = createEnemyEnergyBurner(speed);
            enemyEnergyBurner.init();
          });
          break;

        case enemyTypes.EnemySpeedReduction:
          count = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          speed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: count }).forEach(() => {
            const enemySpeedReduction = createEnemySpeedReduction(speed);
            enemySpeedReduction.init();
          });
          break;

        case enemyTypes.EnemyBorder:
          count = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          speed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: count }).forEach((_, i) => {
            const enemyBorder = createEnemyBorder({
              speed: speed,
              count: count,
              order: i,
            });
            enemyBorder.init();
          });
          break;

        case enemyTypes.EnemyShooter:
          count = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          speed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );
          const projectileSpeed = Math.min(
            enemyTypeOptions.projectileSpeed.perLevel * level +
              enemyTypeOptions.projectileSpeed.init,
            enemyTypeOptions.projectileSpeed.max
          );

          Array.from({ length: count }).forEach((_, i) => {
            const enemyShooter = createEnemyShooter({
              speed,
              projectileSpeed: projectileSpeed,
              shootDistance: enemyTypeOptions.shootDistance,
            });
            enemyShooter.init();
          });
          break;

        default:
          throw new Error('Invalid enemy type');
      }
    });
  }

  private createPointOrbs(count: number): void {
    Array.from({ length: count }).forEach(() => {
      const pointOrb = new PointOrb(
        getRandomPosition({
          minX: saveZoneWidth + 50,
          maxX: renderer._canvasSize.x - saveZoneWidth - 50,
          minY: 50,
          maxY: renderer._canvasSize.y - 50,
        })
      );
      pointOrb.init();
    });
  }

  private clearLevel(): void {
    gameObjectManager.enemies.forEach((e) => e.delete());
    gameObjectManager.pointOrbs.forEach((p) => p.delete());
    gameObjectManager.saveZones.forEach((s) => s.delete());
    gameObjectManager.portals.forEach((s) => s.delete());
    gameObjectManager.projectiles.forEach((p) => p.delete());
  }
}
