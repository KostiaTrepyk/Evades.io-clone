import { SaveZone } from '../../../objects/saveZone/SaveZone';
import { gameObjectManager, renderer } from '../../global';
import { gameMap } from '../../../configs/GameMap/GameMapConfiguration';
import { createEnemyBorder } from './utils/createEnemyBorder';
import { createEnemySpeedReduction } from './utils/createEnemySpeedReduction';
import { createPortal } from './utils/createPortal';
import {
  CommonEnemyConfiguration,
  EnemyBorderConfiguration,
  EnemyConfiguration,
  EnemyEnergyBurnerConfiguration,
  EnemyShooterConfiguration,
  EnemySpeedReductionConfiguration,
  enemyTypes,
} from '../types';
import { createEnemyShooter } from './utils/createEnemyShooter';
import { cellSize } from '../../../consts/consts';
import { createEnemyEnergyBurner } from './utils/createEnemyEnergyBurner';
import { createCommonEnemy } from './utils/createCommonEnemy';
import { createPointOrb } from './utils/createPointOrb';

export interface GenerateLevelConfiguration {
  enemies: EnemyConfiguration[];
  pointOrbCount: number;
  playerPosition: 'start' | 'end';
  portals: {
    prevLevel?: boolean;
    nextLevel?: boolean;
    prevTunnel?: boolean;
    nextTunnel?: boolean;
  };
  saveZones: {
    start: { width: number };
    end: { width: number };
  };
  level: number;
}

export class LevelGenerator {
  public generateLevel(params: GenerateLevelConfiguration): void {
    this.clearLevel();

    this.repositionPlayer(params.playerPosition);

    this.createAndInitAllSaveZones(params.saveZones);
    this.createAndInitAllPortals(params.portals, params.saveZones);
    this.createAndInitAllEnemies(
      params.enemies,
      params.saveZones,
      params.level
    );
    this.createAndInitAllPointOrbs(params.pointOrbCount, params.saveZones);
  }

  private repositionPlayer(
    playerPosition: GenerateLevelConfiguration['playerPosition']
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

  private createAndInitAllSaveZones(
    saveZonesConfiguration: GenerateLevelConfiguration['saveZones']
  ): void {
    const { start, end } = saveZonesConfiguration;
    const saveZoneStart = new SaveZone(
      { x: start.width / 2, y: renderer.canvasSize.y / 2 },
      { x: start.width, y: renderer.canvasSize.y }
    );
    const saveZoneEnd = new SaveZone(
      {
        x: renderer.canvasSize.x - end.width / 2,
        y: renderer.canvasSize.y / 2,
      },
      { x: end.width, y: renderer.canvasSize.y }
    );
    saveZoneStart.init();
    saveZoneEnd.init();
  }

  private createAndInitAllPortals(
    portals: GenerateLevelConfiguration['portals'],
    saveZones: GenerateLevelConfiguration['saveZones']
  ): void {
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
        startPosition: { x: saveZones.start.width / 2, y: cellSize / 2 },
        size: { x: saveZones.start.width, y: cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToPrevTunnel.init();
    }

    if (portals.nextTunnel) {
      const portalToNextTunnel = createPortal({
        startPosition: {
          x: saveZones.start.width / 2,
          y: renderer.canvasSize.y - cellSize / 2,
        },
        size: { x: saveZones.start.width, y: cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToNextTunnel.init();
    }
  }

  private createAndInitAllEnemies(
    enemies: GenerateLevelConfiguration['enemies'],
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: GenerateLevelConfiguration['level']
  ): void {
    enemies.forEach((enemyTypeOptions) => {
      switch (enemyTypeOptions.type) {
        case enemyTypes.CommonEnemy:
          this.createAndInitAllCommonEnemies(
            enemyTypeOptions,
            saveZones,
            level
          );
          break;

        case enemyTypes.EnemyEnergyBurner:
          this.createAndInitAllEnergyBurnerEnemies(
            enemyTypeOptions,
            saveZones,
            level
          );
          break;

        case enemyTypes.EnemySpeedReduction:
          this.createAndInitAllSpeedReductionEnemies(
            enemyTypeOptions,
            saveZones,
            level
          );
          break;

        case enemyTypes.EnemyBorder:
          this.createAndInitAllBorderEnemies(
            enemyTypeOptions,
            saveZones,
            level
          );
          break;

        case enemyTypes.EnemyShooter:
          this.createAndInitAllShooterEnemies(
            enemyTypeOptions,
            saveZones,
            level
          );
          break;

        default:
          throw new Error('Invalid enemy type');
      }
    });
  }

  private createAndInitAllCommonEnemies(
    config: CommonEnemyConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max
    );
    const speed = Math.min(
      config.speed.perLevel * level + config.speed.init,
      config.speed.max
    );

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const enemy = createCommonEnemy({ speed, size: config.size, saveZones });
      enemy.init();
    });
  }

  private createAndInitAllEnergyBurnerEnemies(
    config: EnemyEnergyBurnerConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max
    );
    const speed = Math.min(
      config.speed.perLevel * level + config.speed.init,
      config.speed.max
    );

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const enemy = createEnemyEnergyBurner(speed, saveZones);
      enemy.init();
    });
  }

  private createAndInitAllSpeedReductionEnemies(
    config: EnemySpeedReductionConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max
    );
    const speed = Math.min(
      config.speed.perLevel * level + config.speed.init,
      config.speed.max
    );

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const enemySpeedReduction = createEnemySpeedReduction(speed, saveZones);
      enemySpeedReduction.init();
    });
  }

  private createAndInitAllBorderEnemies(
    config: EnemyBorderConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max
    );
    const speed = Math.min(
      config.speed.perLevel * level + config.speed.init,
      config.speed.max
    );

    Array.from({ length: count }).forEach((_, i) => {
      const enemyBorder = createEnemyBorder({
        speed,
        count,
        order: i,
        saveZones,
      });
      enemyBorder.init();
    });
  }

  private createAndInitAllShooterEnemies(
    config: EnemyShooterConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max
    );
    const speed = Math.min(
      config.speed.perLevel * level + config.speed.init,
      config.speed.max
    );
    const projectileSpeed = Math.min(
      config.projectileSpeed.perLevel * level + config.projectileSpeed.init,
      config.projectileSpeed.max
    );

    Array.from({ length: count }).forEach((_, i) => {
      const enemyShooter = createEnemyShooter({
        speed: speed,
        projectileSpeed: projectileSpeed,
        shootDistance: config.shootDistance,
        saveZones,
      });
      enemyShooter.init();
    });
  }

  private createAndInitAllPointOrbs(
    count: number,
    saveZones: GenerateLevelConfiguration['saveZones']
  ): void {
    Array.from({ length: count }).forEach(() => {
      const pointOrb = createPointOrb(saveZones);
      pointOrb.init();
    });
  }

  /** Delete all objects except player. */
  private clearLevel(): void {
    gameObjectManager.enemies.forEach((e) => e.delete());
    gameObjectManager.pointOrbs.forEach((p) => p.delete());
    gameObjectManager.saveZones.forEach((s) => s.delete());
    gameObjectManager.portals.forEach((s) => s.delete());
    gameObjectManager.projectiles.forEach((p) => p.delete());
  }
}
