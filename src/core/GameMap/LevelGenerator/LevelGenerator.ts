import {
  type EnemyConfiguration,
  type CommonEnemyConfiguration,
  type EnemyEnergyBurnerConfiguration,
  type EnemySpeedReductionConfiguration,
  type EnemyBorderConfiguration,
  type EnemyShooterConfiguration,
  enemyTypes,
} from '../types';

import { createCommonEnemy } from './utils/createCommonEnemy';
import { createEnemyBorder } from './utils/createEnemyBorder';
import { createEnemyEnergyBurner } from './utils/createEnemyEnergyBurner';
import { createEnemyShooter } from './utils/createEnemyShooter';
import { createEnemySpeedReduction } from './utils/createEnemySpeedReduction';
import { createPointOrb } from './utils/createPointOrb';
import { createPortal } from './utils/createPortal';

import { gameMap } from '@config/GameMap/GameMapConfiguration';
import { ENEMYSHOOTERCONFIG } from '@config/enemies/enemyShooter.config';
import { ENEMYSPEEDREDUCTIONCONFIG } from '@config/enemies/enemySpeedReductionconfig';
import { ENERGYBURNERENEMYCONFIG } from '@config/enemies/energyBurnerEnemy.config';
import { GAMECONFIG } from '@config/game.config';
import { POINTORBCONFIG } from '@config/pointOrb.config';
import type { GameObjectManager } from '@core/GameObjectManager';
import type { Renderer } from '@core/Renderer';
import type { RectangleSize } from '@core/common/RectangleObject/RectangleObject';
import { RectangleObjectUtils } from '@core/common/RectangleObject/RectangleObjectUtils';
import { renderer } from '@core/global';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import { SaveZone } from '@game/objects/saveZone/SaveZone';
import type { RectangleBoundary } from '@shared-types/Boundary';
import type { Position } from '@shared-types/Position';
import { getRandomPosition } from '@utils/other/getRandomPosition';
import { getRandomSize } from '@utils/other/getRandomSize';

export interface GenerateLevelConfiguration {
  enemies: EnemyConfiguration[];
  pointOrbCount: number;
  playerPosition: 'start' | 'end';
  portals: {
    prevLevel?: boolean;
    nextLevel?: boolean;
    prevTunnel?: boolean;
    nextTunnel?: boolean;
    other?: {
      size: RectangleSize;
      position: Position;
      onEnter: (player: CharacterBase) => void;
    }[];
  };
  saveZones: {
    start: { width: number };
    end: { width: number };
    other?: { size: RectangleSize; position: Position }[];
  };
  level: number;
}

export class LevelGenerator {
  private readonly _GameObjectManager: GameObjectManager;
  private readonly _Renderer: Renderer;

  constructor(GameObjectManager: GameObjectManager, Renderer: Renderer) {
    this._GameObjectManager = GameObjectManager;
    this._Renderer = Renderer;
  }

  public generateLevel(params: GenerateLevelConfiguration): void {
    this.clearLevel();

    this.repositionPlayer(params.playerPosition);

    const saveZones = this.createAndInitAllSaveZones(params.saveZones);
    const excludedArea = saveZones.map(s => RectangleObjectUtils.getOccupiedArea(s));
    this.createAndInitAllPortals(params.portals, params.saveZones);
    this.createAndInitAllEnemies(params.enemies, params.level, excludedArea, params.saveZones);
    this.createAndInitAllPointOrbs(params.pointOrbCount, excludedArea);
  }

  private repositionPlayer(playerPosition: GenerateLevelConfiguration['playerPosition']): void {
    if (this._GameObjectManager.player) {
      const player = this._GameObjectManager.player;
      if (playerPosition === 'start') {
        player.position.x = player.radius + GAMECONFIG.cellSize;
      } else if (playerPosition === 'end') {
        player.position.x = this._Renderer.canvasSize.x - player.radius - GAMECONFIG.cellSize;
      }
      player.position.y = this._Renderer.canvasSize.y / 2;
    }
  }

  private createAndInitAllSaveZones(config: GenerateLevelConfiguration['saveZones']): SaveZone[] {
    const { start, end } = config;
    const saveZones: SaveZone[] = [];

    const saveZoneStart = new SaveZone(
      { x: start.width / 2, y: this._Renderer.canvasSize.y / 2 },
      { width: start.width, height: this._Renderer.canvasSize.y },
    );
    saveZones.push(saveZoneStart);
    saveZoneStart.init();
    const saveZoneEnd = new SaveZone(
      {
        x: this._Renderer.canvasSize.x - end.width / 2,
        y: this._Renderer.canvasSize.y / 2,
      },
      { width: end.width, height: this._Renderer.canvasSize.y },
    );
    saveZones.push(saveZoneEnd);
    saveZoneEnd.init();

    /* --------------- OTHER --------------- */
    if (config.other !== undefined) {
      config.other.forEach(saveZoneConfig => {
        const saveZone = new SaveZone(saveZoneConfig.position, {
          ...saveZoneConfig.size,
        });
        saveZones.push(saveZone);
        saveZone.init();
      });
    }

    return saveZones;
  }

  private createAndInitAllPortals(
    portals: GenerateLevelConfiguration['portals'],
    saveZones: GenerateLevelConfiguration['saveZones'],
  ): void {
    if (portals.prevLevel === true) {
      const portalToPrevLevel = createPortal({
        startPosition: { x: GAMECONFIG.cellSize / 2, y: this._Renderer.canvasSize.y / 2 },
        size: { width: GAMECONFIG.cellSize, height: this._Renderer.canvasSize.y },
        onEnter: () => gameMap.prevLevel(),
      });
      portalToPrevLevel.init();
    }

    if (portals.nextLevel === true) {
      const portalToNextLevel = createPortal({
        startPosition: {
          x: this._Renderer.canvasSize.x - GAMECONFIG.cellSize / 2,
          y: this._Renderer.canvasSize.y / 2,
        },
        size: { width: GAMECONFIG.cellSize, height: this._Renderer.canvasSize.y },
        onEnter: () => gameMap.nextLevel(),
      });
      portalToNextLevel.init();
    }

    if (portals.prevTunnel === true) {
      const portalToPrevTunnel = createPortal({
        startPosition: { x: saveZones.start.width / 2, y: GAMECONFIG.cellSize / 2 },
        size: { width: saveZones.start.width, height: GAMECONFIG.cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToPrevTunnel.init();
    }

    if (portals.nextTunnel === true) {
      const portalToNextTunnel = createPortal({
        startPosition: {
          x: saveZones.start.width / 2,
          y: this._Renderer.canvasSize.y - GAMECONFIG.cellSize / 2,
        },
        size: { width: saveZones.start.width, height: GAMECONFIG.cellSize },
        onEnter: () => gameMap.moveToTunnel('Central Core'),
      });
      portalToNextTunnel.init();
    }
  }

  private createAndInitAllEnemies(
    enemies: GenerateLevelConfiguration['enemies'],
    level: GenerateLevelConfiguration['level'],
    excludedArea: RectangleBoundary[],
    saveZones: GenerateLevelConfiguration['saveZones'],
  ): void {
    enemies.forEach(enemyTypeOptions => {
      switch (enemyTypeOptions.type) {
        case enemyTypes.CommonEnemy:
          this.createAndInitAllCommonEnemies(enemyTypeOptions, level, excludedArea);
          break;

        case enemyTypes.EnemyEnergyBurner:
          this.createAndInitAllEnergyBurnerEnemies(enemyTypeOptions, level, excludedArea);
          break;

        case enemyTypes.EnemySpeedReduction:
          this.createAndInitAllSpeedReductionEnemies(enemyTypeOptions, level, excludedArea);
          break;

        case enemyTypes.EnemyBorder:
          this.createAndInitAllBorderEnemies(enemyTypeOptions, saveZones, level);
          break;

        case enemyTypes.EnemyShooter:
          this.createAndInitAllShooterEnemies(enemyTypeOptions, level, excludedArea);
          break;

        default:
          throw new Error('Invalid enemy type');
      }
    });
  }

  private createAndInitAllCommonEnemies(
    config: CommonEnemyConfiguration,
    level: number,
    excludedArea: RectangleBoundary[],
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max,
    );
    const speed = Math.min(config.speed.perLevel * level + config.speed.init, config.speed.max);

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const size = getRandomSize(config.radius.min, config.radius.max);
      const position = this.getRandomPosition(
        {
          x: size * 2,
          y: size * 2,
        },
        excludedArea,
      );

      const enemy = createCommonEnemy({ speed, radius: size, position });
      enemy.init();
    });
  }

  private createAndInitAllEnergyBurnerEnemies(
    config: EnemyEnergyBurnerConfiguration,
    level: number,
    excludedArea: RectangleBoundary[],
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max,
    );
    const speed = Math.min(config.speed.perLevel * level + config.speed.init, config.speed.max);

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const position = this.getRandomPosition(
        {
          x: ENERGYBURNERENEMYCONFIG.radius * 2,
          y: ENERGYBURNERENEMYCONFIG.radius * 2,
        },
        excludedArea,
      );
      const enemy = createEnemyEnergyBurner(speed, position);
      enemy.init();
    });
  }

  private createAndInitAllSpeedReductionEnemies(
    config: EnemySpeedReductionConfiguration,
    level: number,
    excludedArea: RectangleBoundary[],
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max,
    );
    const speed = Math.min(config.speed.perLevel * level + config.speed.init, config.speed.max);

    // Create and init enemy
    Array.from({ length: count }).forEach(() => {
      const position = this.getRandomPosition(
        {
          x: ENEMYSPEEDREDUCTIONCONFIG.radius * 2,
          y: ENEMYSPEEDREDUCTIONCONFIG.radius * 2,
        },
        excludedArea,
      );
      const enemySpeedReduction = createEnemySpeedReduction(speed, position);
      enemySpeedReduction.init();
    });
  }

  /* FIX ME Что если сейв зона будет возле стенки (BorderEnemy). */
  private createAndInitAllBorderEnemies(
    config: EnemyBorderConfiguration,
    saveZones: GenerateLevelConfiguration['saveZones'],
    level: number,
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max,
    );
    const speed = Math.min(config.speed.perLevel * level + config.speed.init, config.speed.max);

    Array.from({ length: count }).forEach((e, i) => {
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
    level: number,
    excludedArea: RectangleBoundary[],
  ): void {
    const count = Math.min(
      Math.floor(config.count.perLevel * level) + config.count.init,
      config.count.max,
    );
    const speed = Math.min(config.speed.perLevel * level + config.speed.init, config.speed.max);
    const projectileSpeed = Math.min(
      config.projectileSpeed.perLevel * level + config.projectileSpeed.init,
      config.projectileSpeed.max,
    );

    Array.from({ length: count }).forEach(() => {
      const position = this.getRandomPosition(
        {
          x: ENEMYSHOOTERCONFIG.radius * 2,
          y: ENEMYSHOOTERCONFIG.radius * 2,
        },
        excludedArea,
      );
      const enemyShooter = createEnemyShooter({
        position: position,
        speed: speed,
        projectileSpeed: projectileSpeed,
        shootDistance: config.shootDistance,
      });
      enemyShooter.init();
    });
  }

  private createAndInitAllPointOrbs(count: number, excludedArea: RectangleBoundary[]): void {
    Array.from({ length: count }).forEach(() => {
      const pointOrb = createPointOrb(
        this.getRandomPosition(
          {
            x: POINTORBCONFIG.radius * 2,
            y: POINTORBCONFIG.radius * 2,
          },
          excludedArea,
        ),
      );
      pointOrb.init();
    });
  }

  /** Return random position for enemies, point orbs. */
  private getRandomPosition(
    size: { x: number; y: number },
    excludedArea: RectangleBoundary[],
  ): Position {
    return getRandomPosition({
      allowed: {
        shape: 'rectangle',
        from: { x: 0, y: 0 },
        to: { x: renderer.canvasSize.x, y: renderer.canvasSize.y },
      },
      size: size,
      excludes: excludedArea,
    });
  }

  /** Delete all objects except player. */
  private clearLevel(): void {
    this._GameObjectManager.enemies.forEach(e => e.delete());
    this._GameObjectManager.pointOrbs.forEach(p => p.delete());
    this._GameObjectManager.saveZones.forEach(s => s.delete());
    this._GameObjectManager.portals.forEach(s => s.delete());
    this._GameObjectManager.projectiles.forEach(p => p.delete());
  }
}
