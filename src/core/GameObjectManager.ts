import { Character } from "../objects/character/character";
import { Enemy } from "../objects/enemy/enemy";
import { PointOrb } from "../objects/pointOrb/PointOrb";
import { Portal } from "../objects/portal/portal";
import { SaveZone } from "../objects/saveZone/SaveZone";
import { GameObject } from "./common/GameObject";
import { Shape } from "./types/Shape";

export class GameObjectManager {
  public player: Character | undefined;
  public enemies: Enemy[];
  public pointOrbs: PointOrb[];
  public saveZones: SaveZone[];
  public portals: Portal[];

  constructor() {
    this.enemies = [];
    this.pointOrbs = [];
    this.saveZones = [];
    this.portals = [];
  }

  public updateAll(deltaTime: number): void {
    this.player?.onUpdate(deltaTime);
    this.enemies.forEach((enemy) => enemy.onUpdate(deltaTime));
    this.portals.forEach((portal) => portal.onUpdate(deltaTime));
  }

  public renderAll(ctx: CanvasRenderingContext2D): void {
    /* Order important */
    this.saveZones.forEach((saveZone) => saveZone.onRender(ctx));
    this.portals.forEach((portal) => portal.onRender(ctx));
    this.pointOrbs.forEach((pointOrb) => pointOrb.onRender(ctx));
    this.player?.onRender(ctx);
    this.enemies.forEach((object) => object.onRender(ctx));
  }

  public addGameObject<S extends Shape>(gameObject: GameObject<S>): void {
    switch (true) {
      case gameObject instanceof Character:
        this.player = gameObject;
        break;
      case gameObject instanceof Enemy:
        this.enemies.push(gameObject);
        break;
      case gameObject instanceof PointOrb:
        this.pointOrbs.push(gameObject);
        break;
      case gameObject instanceof SaveZone:
        this.saveZones.push(gameObject);
        break;
      case gameObject instanceof Portal:
        this.portals.push(gameObject);
        break;
      default:
        throw new Error("Unknown game object");
    }
  }

  public removeGameObject<S extends Shape>(gameObject: GameObject<S>) {
    switch (true) {
      case gameObject instanceof Character:
        this.player = undefined;
        break;
      case gameObject instanceof Enemy:
        this.enemies = this.enemies.filter((item) => item !== gameObject);
        break;
      case gameObject instanceof PointOrb:
        this.pointOrbs = this.pointOrbs.filter((item) => item !== gameObject);
        break;
      case gameObject instanceof SaveZone:
        this.saveZones = this.saveZones.filter((item) => item !== gameObject);
        break;
      case gameObject instanceof Portal:
        this.portals = this.portals.filter((item) => item !== gameObject);
        break;
      default:
        throw new Error("Unknown game object");
    }
  }
}
