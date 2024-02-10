import { Position } from "../types/Position";

export abstract class GameObject {
  public position: Position;

  public updateId: number | undefined;
  public renderId: number | undefined;

  constructor(position: Position) {
    this.position = position;
  }

  abstract create(): void;
  abstract delete(): void;

  abstract onUpdate(progress: number): void;
  abstract onRender(progress: number, ctx: CanvasRenderingContext2D): void;
}
