import type { GenerateLevelConfiguration } from './LevelGenerator/LevelGenerator';
import type { Tunnel } from './Tunnel';

import { levelGenerator } from '@core/global';

export class GameMap<TunnelNames extends Record<string, string>> {
  private readonly _tunnels: Tunnel<TunnelNames>[];
  private readonly _playerPositionOnMap: { tunnel: number; level: number };

  constructor(tunnels: Tunnel<TunnelNames>[]) {
    this._tunnels = tunnels;
    this._playerPositionOnMap = { tunnel: 0, level: 0 };
  }

  public prevLevel(): void {
    if (this._playerPositionOnMap.level > 0) {
      this._playerPositionOnMap.level--;
      this.generateCurrentLevel('end');
    }
  }

  public nextLevel(): void {
    if (
      this._tunnels[this._playerPositionOnMap.tunnel].levelsToWin <=
      this._playerPositionOnMap.level + 1
    ) {
      console.log('win');
    } else {
      this._playerPositionOnMap.level++;
      this.generateCurrentLevel('start');
    }
  }

  public moveToTunnel(tunnelName: TunnelNames[keyof TunnelNames]): void {
    this._playerPositionOnMap.tunnel = this.getTunnelIdByName(tunnelName);
    this._playerPositionOnMap.level = 0;
  }

  public generateCurrentLevel(playerPosition: 'start' | 'end'): void {
    levelGenerator.generateLevel({
      ...this.getCurrentLevelConfiguration(),
      playerPosition,
    });
  }

  public getCurrentLevelConfiguration(): GenerateLevelConfiguration {
    return this._tunnels[this._playerPositionOnMap.tunnel].getLevelConfiguration(
      this._playerPositionOnMap.level,
    );
  }

  public getPlayerPositionOnMap(): {
    currentLevel: number;
    tunnel: Tunnel<TunnelNames>;
  } {
    const currentTunnel = this._tunnels[this._playerPositionOnMap.tunnel];
    return {
      currentLevel: this._playerPositionOnMap.level,
      tunnel: currentTunnel,
    };
  }

  private getTunnelIdByName(tunnelName: string): number {
    const id = this._tunnels.findIndex(tunnel => tunnel.name === tunnelName);
    if (id === -1) throw new Error('Tunnel is not found');
    return id;
  }
}
