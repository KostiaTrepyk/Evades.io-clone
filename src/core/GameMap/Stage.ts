import { cellSize } from '../../consts/consts';
import { renderer } from '../global';
import { GenerateLevelConfiguration } from './LevelGenerator/LevelGenerator';
import { LevelConfiguration } from './types';

export class Stage {
  private _levelCount: number;
  private _levelConfiguration: LevelConfiguration;

  constructor(levelCount: number, levelConfiguration: LevelConfiguration) {
    this._levelCount = levelCount;
    this._levelConfiguration = {
      ...levelConfiguration,
    };
  }

  public getLevelConfiguration(level: number): GenerateLevelConfiguration {
    const result: GenerateLevelConfiguration = {
      playerPosition: this._levelConfiguration.playerPosition || 'start',
      pointOrbCount: this._levelConfiguration.pointOrbCount,
      enemies: this._levelConfiguration.enemies,
      portals: {},
      // FIX ME Hard coded width
      saveZones: {
        start: { width: 300 },
        end: { width: 300 },
        other: [
          {
            position: {
              x: renderer.canvasSize.x / 2,
              y: renderer.canvasSize.y / 2,
            },
            size: { x: cellSize * 4, y: cellSize * 4 },
          },
        ],
      },
      level,
    };

    // Portals
    result.portals.nextLevel = true;
    if (level > 0) result.portals.prevLevel = true;

    if (level === 0) {
      result.portals.nextTunnel = true;
      result.portals.prevTunnel = true;
    }
    return result;
  }

  public get levelCount(): number {
    return this._levelCount;
  }
}
