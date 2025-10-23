import {
  GenerateLevelOptions,
  generateLevel,
} from './LevelGenerator/LevelGenerator';
import { Tunnel } from './Tunnel';

export class GameMap<TunnelNames extends Record<string, string>> {
  private tunnels: Tunnel<TunnelNames>[];
  private playerPositionOnMap: { tunnel: number; level: number };

  constructor(tunnels: Tunnel<TunnelNames>[]) {
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

  public moveToTunnel(tunnelName: TunnelNames[keyof TunnelNames]): void {
    this.playerPositionOnMap.tunnel = this.getTunnelIdByName(tunnelName);
    this.playerPositionOnMap.level = 0;
  }

  public generateCurrentLevel(playerPosition: 'start' | 'end'): void {
    generateLevel({ ...this.getCurrentLevelConfiguration(), playerPosition });
  }

  public getCurrentLevelConfiguration(): GenerateLevelOptions {
    return this.tunnels[this.playerPositionOnMap.tunnel].getLevelConfiguration(
      this.playerPositionOnMap.level
    );
  }

  public getPlayerPositionOnMap(): {
    currentLevel: number;
    tunnel: Tunnel<TunnelNames>;
  } {
    const currentTunnel = this.tunnels[this.playerPositionOnMap.tunnel];
    return {
      currentLevel: this.playerPositionOnMap.level,
      tunnel: currentTunnel,
    };
  }

  private getTunnelIdByName(tunnelName: string): number {
    const id = this.tunnels.findIndex((tunnel) => tunnel.name === tunnelName);
    if (id === -1) throw new Error('Tunnel is not found');
    return id;
  }
}
