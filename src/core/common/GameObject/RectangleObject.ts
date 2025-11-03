import { gameObjectManager } from '../../global';
import { Position } from '../../types/Position';
import { RectangleShape } from '../../types/Shape';
import { GameObjectBase } from './GameObjectBase';

export interface RectangleSize {
  height: number;
  width: number;
}

export class RectangleObject extends GameObjectBase {
  public shape: RectangleShape = 'rectangle';
  public size: RectangleSize;

  constructor(startPosition: Position, size: RectangleSize) {
    super(startPosition);
    this.size = size;
  }

  public init(): void {
    gameObjectManager.addGameObject(this);
  }

  public delete(): void {
    gameObjectManager.removeGameObject(this);
  }

  public beforeUpdate?(): void;
  public onUpdate?(): void;
  public afterUpdate?(): void;
  public onRender?(ctx: CanvasRenderingContext2D): void;
}
