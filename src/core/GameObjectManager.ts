import { Character } from '../objects/character/character';
import { Projectile } from '../objects/projectile/projectile';
import { Enemy } from '../objects/enemy/enemy';
import { PointOrb } from '../objects/pointOrb/PointOrb';
import { Portal } from '../objects/portal/portal';
import { SaveZone } from '../objects/saveZone/SaveZone';
import { GameObject } from './common/GameObject/GameObject';
import { Shape } from './types/Shape';

/* Хочу переделать что-бы просто указывать очерёдность рендера и апдейта в файле кфг.
 * Убрать деления на разные типы если возможно, либо сделать минимальное деление,
 * а остальное закинуть в, other. */

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

  constructor() {
    this.enemies = [];
    this.pointOrbs = [];
    this.saveZones = [];
    this.portals = [];
    this.projectiles = [];
  }

  public updateAll(deltaTime: number): void {
    // Before update
    this.player?.beforeUpdate();
    this.projectiles.forEach((projectile) => projectile.beforeUpdate?.());
    this.enemies.forEach((enemy) => enemy.beforeUpdate?.());
    this.portals.forEach((portal) => portal.beforeUpdate?.());

    // Update
    this.player?.onUpdate();
    this.projectiles.forEach((projectile) => projectile.onUpdate());
    this.enemies.forEach((enemy) => enemy.onUpdate());
    this.portals.forEach((portal) => portal.afterUpdate?.());

    // After update
    this.player?.afterUpdate();
    this.projectiles.forEach((projectile) => projectile.afterUpdate?.());
    this.enemies.forEach((enemy) => enemy.afterUpdate?.());
    this.portals.forEach((portal) => portal.afterUpdate?.());
  }

  public renderAll(ctx: CanvasRenderingContext2D): void {
    /* Order important. Это типа как слои которые накладываются. */
    this.saveZones.forEach((saveZone) => saveZone.onRender(ctx));
    this.portals.forEach((portal) => portal.onRender(ctx));
    this.pointOrbs.forEach((pointOrb) => pointOrb.onRender(ctx));
    this.player?.onRender(ctx);
    this.enemies.forEach((object) => object.onRender(ctx));
    this.projectiles.forEach((projectile) => projectile.onRender(ctx));
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
      case gameObject instanceof Projectile:
        this.projectiles.push(gameObject);
        break;
      default:
        throw new Error('Unknown game object');
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
      case gameObject instanceof Projectile:
        this.projectiles = this.projectiles.filter(
          (item) => item !== gameObject
        );
        break;
      default:
        throw new Error('Unknown game object');
    }
  }
}
