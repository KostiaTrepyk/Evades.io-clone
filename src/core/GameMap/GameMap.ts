import {
  GenerateLevelOptions,
  generateLevel,
} from './LevelGenerator/LevelGenerator';
import { Tunel } from './Tunel';

export class GameMap {
  private _tunels: Tunel[];
  private _playerPositionOnMap: { tunel: number; level: number };

  constructor(tunels: Tunel[]) {
    this._tunels = tunels;
    this._playerPositionOnMap = { tunel: 0, level: 0 };
  }

  public prevLevel(): void {
    if (this._playerPositionOnMap.level > 0) {
      this._playerPositionOnMap.level--;
      this.generateCurrentLevel('end');
    }
  }

  public nextLevel(): void {
    if (
      this._tunels[this._playerPositionOnMap.tunel].levelsToWin <=
      this._playerPositionOnMap.level + 1
    ) {
      console.log('win');
    } else {
      this._playerPositionOnMap.level++;
      this.generateCurrentLevel('start');
    }
  }

  public prevTunel(): void {
    if (this._playerPositionOnMap.tunel <= 0) {
      this._playerPositionOnMap.tunel = this._tunels.length - 1;
    } else {
      this._playerPositionOnMap.tunel--;
    }
    this._playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public nextTunel(): void {
    if (this._playerPositionOnMap.tunel >= this._tunels.length - 1) {
      this._playerPositionOnMap.tunel = 0;
    } else {
      this._playerPositionOnMap.tunel++;
    }
    this._playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public generateCurrentLevel(playerPosition: 'start' | 'end'): void {
    generateLevel({ ...this.getCurrentLevelConfiguration(), playerPosition });
  }

  public getCurrentLevelConfiguration(): GenerateLevelOptions {
    return this._tunels[this._playerPositionOnMap.tunel].getlevelConfiguration(
      this._playerPositionOnMap.level
    );
  }

  public getCurrentTunnelDetails(): {
    currentLevel: number;
    tunnel: Tunel;
  } {
    const currentTunnel = this._tunels[this._playerPositionOnMap.tunel];
    return {
      currentLevel: this._playerPositionOnMap.level,
      tunnel: currentTunnel,
    };
  }
}
