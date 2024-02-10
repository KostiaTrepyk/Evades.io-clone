import { GameObject } from "../core/common/GameObject";
import { gameloop } from "../core/global";
import { Position } from "../core/types/Position";
import { RenderEnemyModel } from "./enemy.model";

export class Enemy implements GameObject {
  public speed: number;
  public position: Position;

  private updateId: number | undefined;
  private renderId: number | undefined;

  constructor(position: Position) {
    this.position = position;
    this.speed = 100;
  }

  create(): void {
    this.updateId = gameloop.addOnUpdate(this.onUpdate.bind(this));
    this.renderId = gameloop.addOnRender(this.onRender.bind(this));
  }

  delete(): void {
    if (this.updateId) {
      gameloop.removeOnUpdate(this.updateId);
      this.updateId = undefined;
    }

    if (this.renderId) {
      gameloop.removeOnRender(this.renderId);
      this.renderId = undefined;
    }
  }

  onUpdate(progress: number): void {
    this.position.y += this.speed * progress;

    if (this.position.y > window.innerHeight) this.position.y = 0;
  }

  onRender(progress: number, ctx: CanvasRenderingContext2D): void {
    RenderEnemyModel(ctx, this.position);
  }
}
