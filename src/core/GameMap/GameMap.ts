import {
  GenerateLevelOptions,
  generateLevel,
} from './LevelGenerator/LevelGenerator';
import { Tunel } from './Tunel';

export class GameMap {
  private tunels: Tunel[];
  private playerPositionOnMap: { tunel: number; level: number };

  constructor(tunels: Tunel[]) {
    this.tunels = tunels;
    this.playerPositionOnMap = { tunel: 0, level: 0 };
  }

  public prevLevel(): void {
    if (this.playerPositionOnMap.level > 0) {
      this.playerPositionOnMap.level--;
      this.generateCurrentLevel('end');
    }
  }

  public prevTunel(): void {
    if (this.playerPositionOnMap.tunel <= 0) {
      this.playerPositionOnMap.tunel = this.tunels.length - 1;
    } else {
      this.playerPositionOnMap.tunel--;
    }
    this.playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public nextTunel(): void {
    if (this.playerPositionOnMap.tunel >= this.tunels.length - 1) {
      this.playerPositionOnMap.tunel = 0;
    } else {
      this.playerPositionOnMap.tunel++;
    }
    this.playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public nextLevel(): void {
    if (
      this.tunels[this.playerPositionOnMap.tunel].getLevelsToWin() <=
      this.playerPositionOnMap.level + 1
    ) {
      console.log('win');
    } else {
      this.playerPositionOnMap.level++;
      this.generateCurrentLevel('start');
    }
  }

  public generateCurrentLevel(playerPosition: 'start' | 'end'): void {
    generateLevel({ ...this.getCurrentLevelConfiguration(), playerPosition });
  }

  public getCurrentLevelConfiguration(): GenerateLevelOptions {
    return this.tunels[this.playerPositionOnMap.tunel].getlevelConfiguration(
      this.playerPositionOnMap.level
    );
  }

  public getCurrentTunelName(): string {
    return this.tunels[this.playerPositionOnMap.tunel].getName();
  }
}
