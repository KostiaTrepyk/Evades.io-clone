import { SaveZone } from '../../../objects/saveZone/SaveZone';
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
import { GameObjectManager } from '../../GameObjectManager';
import { Renderer } from '../../Renderer';
import { Position } from '../../types/Position';
import {
  getRandomPosition,
  GetRandomPositionParams,
} from '../../utils/other/getRandomPosition';
import { renderer } from '../../global';
import { POINTORBCONFIG } from '../../../configs/pointOrb.config';
import { ENEMYSHOOTERCONFIG } from '../../../configs/enemies/enemyShooter.config';
import { ENEMYSPEEDREDUCTIONCONFIG } from '../../../configs/enemies/enemySpeedReductionconfig';
import { ENERGYBURNERENEMYCONFIG } from '../../../configs/enemies/energyBurnerEnemy.config';
import { getRandomSize } from '../../utils/other/getRandomSize';

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
    other?: { size: { x: number; y: number }; position: Position }[];
  };
  level: number;
}

export class LevelGenerator {
  private _GameObjectManager: GameObjectManager;
  private _Renderer: Renderer;

  constructor(GameObjectManager: GameObjectManager, Renderer: Renderer) {
    this._GameObjectManager = GameObjectManager;
    this._Renderer = Renderer;
  }

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
    if (this._GameObjectManager.player) {
      const player = this._GameObjectManager.player;
      if (playerPosition === 'start') {
        player.position.x = player.objectModel.radius + cellSize;
      } else if (playerPosition === 'end') {
        player.position.x =
          this._Renderer.canvasSize.x - player.objectModel.radius - cellSize;
      }
      player.position.y = this._Renderer.canvasSize.y / 2;
    }
  }

  private createAndInitAllSaveZones(
    config: GenerateLevelConfiguration['saveZones']
  ): void {
    const { start, end } = config;
    const saveZoneStart = new SaveZone(
      { x: start.width / 2, y: this._Renderer.canvasSize.y / 2 },
      { x: start.width, y: this._Renderer.canvasSize.y }
    );
    saveZoneStart.init();
    const saveZoneEnd = new SaveZone(
      {
        x: this._Renderer.canvasSize.x - end.width / 2,
        y: this._Renderer.canvasSize.y / 2,
      },
      { x: end.width, y: this._Renderer.canvasSize.y }
    );
    saveZoneEnd.init();

    /* --------------- OTHER --------------- */
    if (config.other !== undefined) {
      config.other.forEach((saveZoneConfig) => {
        const saveZone = new SaveZone(saveZoneConfig.position, {
          ...saveZoneConfig.size,
        });
        saveZone.init();
      });
    }
  }

  private createAndInitAllPortals(
    portals: GenerateLevelConfiguration['portals'],
    saveZones: GenerateLevelConfiguration['saveZones']
  ): void {
    if (portals.prevLevel) {
      const portalToPrevLevel = createPortal({
        startPosition: { x: cellSize / 2, y: this._Renderer.canvasSize.y / 2 },
        size: { x: cellSize, y: this._Renderer.canvasSize.y },
        onEnter: () => gameMap.prevLevel(),
      });
      portalToPrevLevel.init();
    }

    if (portals.nextLevel) {
      const portalToNextLevel = createPortal({
        startPosition: {
          x: this._Renderer.canvasSize.x - cellSize / 2,
          y: this._Renderer.canvasSize.y / 2,
        },
        size: { x: cellSize, y: this._Renderer.canvasSize.y },
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
          y: this._Renderer.canvasSize.y - cellSize / 2,
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
      const size = getRandomSize(config.radius.min, config.radius.max);
      const position = this.getRandomPosition(saveZones, {
        x: size * 2,
        y: size * 2,
      });

      const enemy = createCommonEnemy({ speed, size, position });
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
      const position = this.getRandomPosition(saveZones, {
        x: ENERGYBURNERENEMYCONFIG.radius * 2,
        y: ENERGYBURNERENEMYCONFIG.radius * 2,
      });
      const enemy = createEnemyEnergyBurner(speed, position);
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
      const position = this.getRandomPosition(saveZones, {
        x: ENEMYSPEEDREDUCTIONCONFIG.radius * 2,
        y: ENEMYSPEEDREDUCTIONCONFIG.radius * 2,
      });
      const enemySpeedReduction = createEnemySpeedReduction(speed, position);
      enemySpeedReduction.init();
    });
  }

  /* FIX ME Что если сейв зона будет возле стенки. */
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
      const position = this.getRandomPosition(saveZones, {
        x: ENEMYSHOOTERCONFIG.radius * 2,
        y: ENEMYSHOOTERCONFIG.radius * 2,
      });
      const enemyShooter = createEnemyShooter({
        position: position,
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
      const pointOrb = createPointOrb(
        this.getRandomPosition(saveZones, {
          x: POINTORBCONFIG.radius * 2,
          y: POINTORBCONFIG.radius * 2,
        })
      );
      pointOrb.init();
    });
  }

  /** Return random position for enemies, point orbs */
  private getRandomPosition(
    saveZonesConfig: GenerateLevelConfiguration['saveZones'],
    size: { x: number; y: number }
  ): Position {
    const excludes: GetRandomPositionParams['excludes'] = [];

    if (saveZonesConfig.other !== undefined) {
      for (const saveZone of saveZonesConfig.other) {
        const from = {
          x: saveZone.position.x - saveZone.size.x / 2,
          y: saveZone.position.y - saveZone.size.y / 2,
        };
        const to = {
          x: saveZone.position.x + saveZone.size.x / 2,
          y: saveZone.position.y + saveZone.size.y / 2,
        };
        excludes.push({ from, to });
      }
    }

    return getRandomPosition({
      allowed: {
        from: {
          x: saveZonesConfig.start.width,
          y: 0,
        },
        to: {
          x: renderer.canvasSize.x - saveZonesConfig.end.width,
          y: renderer.canvasSize.y,
        },
      },
      size: size,
      excludes: excludes,
    });
  }

  /** Delete all objects except player. */
  private clearLevel(): void {
    this._GameObjectManager.enemies.forEach((e) => e.delete());
    this._GameObjectManager.pointOrbs.forEach((p) => p.delete());
    this._GameObjectManager.saveZones.forEach((s) => s.delete());
    this._GameObjectManager.portals.forEach((s) => s.delete());
    this._GameObjectManager.projectiles.forEach((p) => p.delete());
  }
}
