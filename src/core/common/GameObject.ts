import { gameObjectManager } from "../global";
import { UniqueId } from "../helpers/UniqueId";
import { Position } from "../types/Position";
import { Shape } from "../types/Shape";

const gameObjectsId = new UniqueId();

export type ObjectModel<S extends Shape> = S extends "circle"
  ? { shape: "circle"; size: number }
  : S extends "rectangular"
  ? { shape: "rectangular"; size: { x: number; y: number } }
  : never;

export class GameObject<S extends Shape> {
  public id: number;
  public position: Position;
  public objectModel: ObjectModel<S>;

  constructor(startPosition: Position, objectModel: ObjectModel<S>) {
    this.id = gameObjectsId.get();
    this.position = startPosition;
    this.objectModel = objectModel;
  }

  public create(): void {}
  public delete(): void {}

  public onUpdate(deltaTime: number): void {}
  public onRender(ctx: CanvasRenderingContext2D): void {}
}
