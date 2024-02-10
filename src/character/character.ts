import { GameObject } from "../core/common/GameObject";
import { gameloop } from "../core/global";
import { Position } from "../core/types/Position";
import { RenderCharacterModel } from "./character.model";
import { CharacterMovement } from "./character.movement";

export class Character implements GameObject {
  private characterMovement: CharacterMovement;
  public position: Position;
  public updateId: number | undefined;
  public renderId: number | undefined;

  constructor(startPsition: Position) {
    this.position = startPsition;
    this.characterMovement = new CharacterMovement(startPsition);
  }

  create() {
    this.characterMovement.bind();
    this.updateId = gameloop.addOnUpdate(this.onUpdate.bind(this));
    this.renderId = gameloop.addOnRender(this.onRender.bind(this));
  }

  delete() {
    this.characterMovement.unbind();

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
    this.characterMovement.onUpdate(progress);
  }

  onRender(progress: number, ctx: CanvasRenderingContext2D) {
    RenderCharacterModel(ctx, this.characterMovement.position);
  }
}
