import { gameObjectManager } from '../../global';
import { Position } from '../../types/Position';
import { CircleShape, RectangleShape, Shape } from '../../types/Shape';
import { GameObjectLoopMethods } from './GameObjectLoopMethods';

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
export class GameObject<S extends Shape> implements GameObjectLoopMethods {
  /** От 0 (задний план) до 9 (передний план) */
  public readonly renderId: number = 0;

  public prevPosition: Position;
  /** Center of the object */
  public position: Position;
  public objectModel: ObjectModel<S>;

  constructor(startPosition: Position, objectModel: ObjectModel<S>) {
    this.prevPosition = startPosition;
    this.position = startPosition;
    this.objectModel = objectModel;
  }

  public beforeUpdate?(): void;
  public onUpdate?(): void;
  public afterUpdate?(): void;
  public onRender?(ctx: CanvasRenderingContext2D): void;

  public init(): void {
    gameObjectManager.addGameObject(this);
  }

  public delete(): void {
    gameObjectManager.removeGameObject(this);
  }
}
