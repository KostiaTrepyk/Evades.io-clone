import { gameObjectManager } from '../global';
import { Position } from '../types/Position';
import { Shape } from '../types/Shape';

export type ObjectModel<S extends Shape> = S extends 'circle'
  ? { shape: 'circle'; size: number }
  : S extends 'rectangle'
  ? { shape: 'rectangle'; size: { x: number; y: number } }
  : never;

export class GameObject<S extends Shape> {
  public position: Position;
  public objectModel: ObjectModel<S>;

  constructor(startPosition: Position, objectModel: ObjectModel<S>) {
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
