import { Character } from '../objects/character/character';
import { Projectile } from '../objects/projectile/projectile';
import { Enemy } from '../objects/enemy/enemy';
import { PointOrb } from '../objects/pointOrb/PointOrb';
import { Portal } from '../objects/portal/portal';
import { SaveZone } from '../objects/saveZone/SaveZone';
import { CircleObject } from './common/GameObject/CircleObject';
import { RectangleObject } from './common/GameObject/RectangleObject';

/** Отвечает за Все объекты в игре. Разделяет объекты через instanceof на разные
 * категории: player, enemies, pointOrbs и тд. За их добавление, удаление и вызывает
 * у них update и render. */
export class GameObjectManager {
  public player: Character | undefined;
  public enemies: Enemy[];
  public pointOrbs: PointOrb[];
  public saveZones: SaveZone[];
  public portals: Portal[];
  public projectiles: Projectile[];

  private _beforeUpdates: {
    o: RectangleObject | CircleObject;
    f: () => void;
  }[];
  private _updates: { o: RectangleObject | CircleObject; f: () => void }[];
  private _afterUpdates: { o: RectangleObject | CircleObject; f: () => void }[];
  private _render: {
    o: RectangleObject | CircleObject;
    f: (ctx: CanvasRenderingContext2D) => void;
  }[][];

  constructor() {
    this.enemies = [];
    this.pointOrbs = [];
    this.saveZones = [];
    this.portals = [];
    this.projectiles = [];

    this._beforeUpdates = [];
    this._updates = [];
    this._afterUpdates = [];

    this._render = [];
    for (let i = 0; i < 10; i++) {
      this._render[i] = [];
    }
  }

  public updateAll(): void {
    this._beforeUpdates.forEach(({ f }) => f());
    this._updates.forEach(({ f }) => f());
    this._afterUpdates.forEach(({ f }) => f());
  }

  public renderAll(ctx: CanvasRenderingContext2D): void {
    for (const renderArrays of this._render) {
      for (const { f } of renderArrays) {
        f(ctx);
      }
    }
  }

  public addGameObject(object: RectangleObject | CircleObject): void {
    this.bindObject(object);

    switch (true) {
      case object instanceof Character:
        this.player = object;
        break;
      case object instanceof Enemy:
        this.enemies.push(object);
        break;
      case object instanceof PointOrb:
        this.pointOrbs.push(object);
        break;
      case object instanceof SaveZone:
        this.saveZones.push(object);
        break;
      case object instanceof Portal:
        this.portals.push(object);
        break;
      case object instanceof Projectile:
        this.projectiles.push(object);
        break;
      default:
        throw new Error('Unknown game object');
    }
  }

  public removeGameObject(object: RectangleObject | CircleObject) {
    this.unbindObject(object);

    switch (true) {
      case object instanceof Character:
        this.player = undefined;
        break;
      case object instanceof Enemy:
        this.enemies = this.enemies.filter((item) => item !== object);
        break;
      case object instanceof PointOrb:
        this.pointOrbs = this.pointOrbs.filter((item) => item !== object);
        break;
      case object instanceof SaveZone:
        this.saveZones = this.saveZones.filter((item) => item !== object);
        break;
      case object instanceof Portal:
        this.portals = this.portals.filter((item) => item !== object);
        break;
      case object instanceof Projectile:
        this.projectiles = this.projectiles.filter((item) => item !== object);
        break;
      default:
        throw new Error('Unknown game object');
    }
  }

  private bindObject(object: RectangleObject | CircleObject): void {
    if (object.beforeUpdate !== undefined)
      this._beforeUpdates.push({
        o: object,
        f: object.beforeUpdate.bind(object),
      });
    if (object.onUpdate !== undefined)
      this._updates.push({
        o: object,
        f: object.onUpdate.bind(object),
      });
    if (object.afterUpdate !== undefined)
      this._afterUpdates.push({
        o: object,
        f: object.afterUpdate.bind(object),
      });
    if (object.onRender !== undefined)
      this._render[object.renderId].push({
        o: object,
        f: object.onRender.bind(object),
      });
  }

  private unbindObject(object: RectangleObject | CircleObject): void {
    const id1 = this._beforeUpdates.findIndex(({ o }) => o === object);
    if (id1 !== -1) this._beforeUpdates.splice(id1, 1);

    const id2 = this._updates.findIndex(({ o }) => o === object);
    if (id2 !== -1) this._updates.splice(id2, 1);

    const id3 = this._afterUpdates.findIndex(({ o }) => o === object);
    if (id3 !== -1) this._afterUpdates.splice(id3, 1);

    const id4 = this._render[object.renderId].findIndex(
      ({ o }) => o === object
    );
    if (id4 !== -1) this._render[object.renderId].splice(id4, 1);
  }
}
