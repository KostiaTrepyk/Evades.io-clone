import {
  GenerateLevelOptions,
  generateLevel,
} from './LevelGenerator/LevelGenerator';
import { Tunnel } from './Tunnel';

export class GameMap {
  private tunnels: Tunnel[];
  private playerPositionOnMap: { tunnel: number; level: number };

  constructor(tunnels: Tunnel[]) {
    this.tunnels = tunnels;
    this.playerPositionOnMap = { tunnel: 0, level: 0 };
  }

  public prevLevel(): void {
    if (this.playerPositionOnMap.level > 0) {
      this.playerPositionOnMap.level--;
      this.generateCurrentLevel('end');
    }
  }

  public nextLevel(): void {
    if (
      this.tunnels[this.playerPositionOnMap.tunnel].levelsToWin <=
      this.playerPositionOnMap.level + 1
    ) {
      console.log('win');
    } else {
      this.playerPositionOnMap.level++;
      this.generateCurrentLevel('start');
    }
  }

  public prevTunnel(): void {
    if (this.playerPositionOnMap.tunnel <= 0) {
      this.playerPositionOnMap.tunnel = this.tunnels.length - 1;
    } else {
      this.playerPositionOnMap.tunnel--;
    }
    this.playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public nextTunnel(): void {
    if (this.playerPositionOnMap.tunnel >= this.tunnels.length - 1) {
      this.playerPositionOnMap.tunnel = 0;
    } else {
      this.playerPositionOnMap.tunnel++;
    }
    this.playerPositionOnMap.level = 0;
    this.generateCurrentLevel('start');
  }

  public generateCurrentLevel(playerPosition: 'start' | 'end'): void {
    generateLevel({ ...this.getCurrentLevelConfiguration(), playerPosition });
  }

  public getCurrentLevelConfiguration(): GenerateLevelOptions {
    return this.tunnels[this.playerPositionOnMap.tunnel].getLevelConfiguration(
      this.playerPositionOnMap.level
    );
  }

  public getPlayerDetails(): {
    currentLevel: number;
    tunnel: Tunnel;
  } {
    const currentTunnel = this.tunnels[this.playerPositionOnMap.tunnel];
    return {
      currentLevel: this.playerPositionOnMap.level,
      tunnel: currentTunnel,
    };
  }
}
