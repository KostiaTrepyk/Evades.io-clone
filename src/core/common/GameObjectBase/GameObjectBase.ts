import { Position } from '../../types/Position';
import { GameObjectLoopMethods } from './GameObjectLoopMethods';

/** Каждый объект может быть только шаром либо прямоугольником. */
export abstract class GameObjectBase implements GameObjectLoopMethods {
  /** От 0 (задний план) до 9 (передний план) */
  public readonly renderId: number = 0;

  public prevPosition: Position;
  /** Center of the object */
  public position: Position;

  constructor(startPosition: Position) {
    this.prevPosition = startPosition;
    this.position = startPosition;
  }

  public abstract beforeUpdate?(): void;
  public abstract onUpdate?(): void;
  public abstract afterUpdate?(): void;
  public abstract onRender?(ctx: CanvasRenderingContext2D): void;

  public abstract init(): void;
  public abstract delete(): void;
}
