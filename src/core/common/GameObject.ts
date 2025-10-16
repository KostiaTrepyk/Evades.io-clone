import { gameObjectManager } from '../global';
import { Position } from '../types/Position';
import { CircleShape, RectangleShape, Shape } from '../types/Shape';

export type CircleProperties = { shape: CircleShape; size: number };
export type RectangleProperties = {
  shape: RectangleShape;
  size: { x: number; y: number };
};

export type ObjectModel<S extends Shape> = S extends CircleShape
  ? CircleProperties
  : S extends RectangleShape
  ? RectangleProperties
  : never;

/** Каждый объект может быть только шаром либо прямоугольником. */
export class GameObject<S extends Shape> {
  public prevPosition: Position;
  public position: Position;
  public objectModel: ObjectModel<S>;

  constructor(startPosition: Position, objectModel: ObjectModel<S>) {
    this.prevPosition = startPosition;
    this.position = startPosition;
    this.objectModel = objectModel;
  }

  public create(): void {
    gameObjectManager.addGameObject(this);
  }

  public delete(): void {
    gameObjectManager.removeGameObject(this);
  }

  public onUpdate?(deltaTime: number): void;
  public afterUpdate?(deltaTime: number): void;
  public onRender?(ctx: CanvasRenderingContext2D): void;
}
