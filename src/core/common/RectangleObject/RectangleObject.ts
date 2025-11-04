import { GameObjectBase } from '../GameObjectBase/GameObjectBase';

import { gameObjectManager } from '@core/global';
import type { Position } from '@shared-types/Position';
import type { RectangleShape } from '@shared-types/Shape';

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
