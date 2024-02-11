import { Interaction } from "../../core/Interaction";
import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderCharacterModel } from "./character.model";
import { CharacterMovement } from "./character.movement";
import { LVLSystem } from "./lvl.system";

export class Character extends GameObject<"circle"> {
  private characterMovement: CharacterMovement;
  private lvlSystem: LVLSystem;
  public isDead: boolean;

  constructor(startPsition: Position, size: number) {
    super(startPsition, { shape: "circle", size });
    this.characterMovement = new CharacterMovement(startPsition, size);
    this.lvlSystem = new LVLSystem();
    this.isDead = false;
  }

  public override create() {
    gameObjectManager.setPlayer(this);
    this.characterMovement.bind();
  }

  public override delete() {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    gameObjectManager.setPlayer(undefined);
    this.characterMovement.unbind();
  }

  public revive(): void {
    this.isDead = false;
    this.characterMovement.unblock();
  }

  public die(): void {
    this.isDead = true;
    this.characterMovement.block();
  }

  public override onUpdate(progress: number): void {
    this.characterMovement.onUpdate(progress);

    const intersection = new Interaction();
    gameObjectManager.enemies.forEach((gameObject) => {
      if (
        intersection.intersect(
          {
            position: this.position,
            shape: "circle",
            size: this.objectModel.size,
          },
          {
            position: gameObject.position,
            shape: "circle",
            size: gameObject.objectModel.size,
          }
        )
      ) {
        if (!this.isDead) {
          this.die();

          setTimeout(() => {
            this.revive();
          }, 1_500);
        }
      }
    });
    gameObjectManager.pointOrbs.forEach((pointOrb) => {
      if (
        intersection.intersect(
          {
            position: this.position,
            shape: "circle",
            size: this.objectModel.size,
          },
          {
            position: pointOrb.position,
            shape: "circle",
            size: pointOrb.objectModel.size,
          }
        )
      ) {
        pointOrb.delete();
        this.lvlSystem.addPointOrb();
      }
    });
  }

  public override onRender(ctx: CanvasRenderingContext2D) {
    if (this.isDead) {
      RenderCharacterModel.dead(
        ctx,
        this.characterMovement.position,
        this.objectModel.size
      );
    } else {
      RenderCharacterModel.default(
        ctx,
        this.characterMovement.position,
        this.objectModel.size
      );
    }
  }
}
