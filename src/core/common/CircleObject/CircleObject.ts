import { gameObjectManager } from '../../global';
import { Position } from '../../types/Position';
import { CircleShape } from '../../types/Shape';
import { GameObjectBase } from '../GameObjectBase/GameObjectBase';

export class CircleObject extends GameObjectBase {
  public shape: CircleShape = 'circle';
  public radius: number;

  constructor(startPosition: Position, radius: number) {
    super(startPosition);
    this.radius = radius;
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
