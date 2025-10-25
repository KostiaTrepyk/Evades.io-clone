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
          renderer.canvasSize.x - player.objectModel.size / 2 - cellSize;
      }
      player.position.y = renderer.canvasSize.y / 2;
    }
  }

  private createSaveZones(): void {
    const saveZoneStart = new SaveZone(
      { x: saveZoneWidth / 2, y: renderer.canvasSize.y / 2 },
      { x: saveZoneWidth, y: renderer.canvasSize.y }
    );
    const saveZoneEnd = new SaveZone(
      {
        x: renderer.canvasSize.x - saveZoneWidth / 2,
        y: renderer.canvasSize.y / 2,
      },
      { x: saveZoneWidth, y: renderer.canvasSize.y }
    );
    saveZoneStart.init();
    saveZoneEnd.init();
  }

  private createPortals(portals: GenerateLevelOptions['portals']): void {
    if (portals.prevLevel) {
      const portalToPrevLevel = createPortal({
        startPosition: { x: cellSize / 2, y: renderer.canvasSize.y / 2 },
        size: { x: cellSize, y: renderer.canvasSize.y },
        onEnter: () => gameMap.prevLevel(),
      });
      portalToPrevLevel.init();
    }
    if (portals.nextLevel) {
      const portalToNextLevel = createPortal({
        startPosition: {
          x: renderer.canvasSize.x - cellSize / 2,
          y: renderer.canvasSize.y / 2,
        },
        size: { x: cellSize, y: renderer.canvasSize.y },
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
          const commonEnemyCount = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          const commonEnemySpeed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: commonEnemyCount }).forEach(() => {
            const commonEnemy = createCommonEnemy({
              size: enemyTypeOptions.size,
              speed: commonEnemySpeed,
            });
            commonEnemy.init();
          });
          break;

        case enemyTypes.EnemyEnergyBurner:
          const EnemyEnergyBurnerCount = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          const EnemyEnergyBurnerSpeed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: EnemyEnergyBurnerCount }).forEach(() => {
            const enemyEnergyBurner = createEnemyEnergyBurner(
              EnemyEnergyBurnerSpeed
            );
            enemyEnergyBurner.init();
          });
          break;

        case enemyTypes.EnemySpeedReduction:
          const EnemySpeedReductionCount = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          const EnemySpeedReductionSpeed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: EnemySpeedReductionCount }).forEach(() => {
            const enemySpeedReduction = createEnemySpeedReduction(
              EnemySpeedReductionSpeed
            );
            enemySpeedReduction.init();
          });
          break;

        case enemyTypes.EnemyBorder:
          const EnemyBorderCount = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          const EnemyBorderSpeed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );

          Array.from({ length: EnemyBorderCount }).forEach((_, i) => {
            const enemyBorder = createEnemyBorder({
              speed: EnemyBorderSpeed,
              count: EnemyBorderCount,
              order: i,
            });
            enemyBorder.init();
          });
          break;

        case enemyTypes.EnemyShooter:
          const EnemyShooterCount = Math.min(
            Math.floor(enemyTypeOptions.count.perLevel * level) +
              enemyTypeOptions.count.init,
            enemyTypeOptions.count.max
          );
          const EnemyShooterSpeed = Math.min(
            enemyTypeOptions.speed.perLevel * level +
              enemyTypeOptions.speed.init,
            enemyTypeOptions.speed.max
          );
          const projectileSpeed = Math.min(
            enemyTypeOptions.projectileSpeed.perLevel * level +
              enemyTypeOptions.projectileSpeed.init,
            enemyTypeOptions.projectileSpeed.max
          );

          Array.from({ length: EnemyShooterCount }).forEach((_, i) => {
            const enemyShooter = createEnemyShooter({
              speed: EnemyShooterSpeed,
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
          maxX: renderer.canvasSize.x - saveZoneWidth - 50,
          minY: 50,
          maxY: renderer.canvasSize.y - 50,
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
