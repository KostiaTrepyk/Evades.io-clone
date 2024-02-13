import { Character } from "../objects/character/character";
import { Enemy } from "../objects/enemy/enemy";
import { PointOrb } from "../objects/pointOrb/PointOrb";
import { SaveZone } from "../objects/saveZone/SaveZone";

export class GameObjectManager {
  public player: Character | undefined;
  public enemies: Enemy[];
  public pointOrbs: PointOrb[];
  public saveZones: SaveZone[];

  constructor() {
    this.enemies = [];
    this.pointOrbs = [];
    this.saveZones = [];
  }

  public updateAll(deltaTime: number): void {
    this.player?.onUpdate(deltaTime);
    this.enemies.forEach((gameObject) => {
      gameObject.onUpdate(deltaTime);
    });
  }

  public renderAll(ctx: CanvasRenderingContext2D): void {
    /* Order important */
    this.saveZones.forEach((saveZone) => {
      saveZone.onRender(ctx);
    });
    this.pointOrbs.forEach((pointOrb) => {
      pointOrb.onRender(ctx);
    });
    this.player?.onRender(ctx);
    this.enemies.forEach((object) => {
      object.onRender(ctx);
    });
  }

  public getPlayer(): Character | undefined {
    return this.player;
  }

  public setPlayer(player: Character | undefined): void {
    this.player = player;
  }

  public addEnemy(item: Enemy): void {
    this.enemies.push(item);
  }
  public removeEnemy(id: number): void {
    this.enemies = this.enemies.filter((item) => item.id !== id);
  }

  public addPointOrb(item: PointOrb): void {
    this.pointOrbs.push(item);
  }
  public removePointOrb(id: number): void {
    this.pointOrbs = this.pointOrbs.filter((pointOrb) => pointOrb.id !== id);
  }
}
