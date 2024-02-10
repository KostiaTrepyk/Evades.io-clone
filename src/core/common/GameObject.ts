import { gameObjectsManager, gameloop } from "../global";
import { UniqueId } from "../helpers/uniqueId";
import { Position } from "../types/Position";

const gameObjectsId = new UniqueId();

export class GameObject {
  public id: number;
  public position: Position;

  constructor(startPosition: Position) {
    this.id = gameObjectsId.get();
    this.position = startPosition;
  }

  public create(): void {
    gameObjectsManager.addItem(this)
  }
  public delete(): void {
    gameObjectsManager.removeItem(this.id)
  }

  public onUpdate(progress: number): void {}
  public onRender(ctx: CanvasRenderingContext2D): void {}
}
