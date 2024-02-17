import { Interaction } from "../../core/Interaction";
import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager, levelManager, renderer } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderCharacterModel } from "./character.model";
import { CharacterMovement } from "./character.movement";
import { LVLSystem } from "./lvl.system";

export class Character extends GameObject<"circle"> {
  public characterMovement: CharacterMovement;
  private lvlSystem: LVLSystem;
  public isDead: boolean;
  public mana: { max: number; current: number };
  public timeToDeath: number | undefined;

  public statuses: ("immortal" | "")[];

  constructor(startPsition: Position, size: number) {
    super(startPsition, { shape: "circle", size });
    this.characterMovement = new CharacterMovement(startPsition, size);
    this.lvlSystem = new LVLSystem();
    this.isDead = false;
    this.mana = { max: 30, current: 30 };
    this.statuses = [];
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
    let canBeRevived: boolean = true;
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
        canBeRevived = false;
      }
    });

    if (canBeRevived) {
      this.isDead = false;
      this.characterMovement.unblock();
      this.timeToDeath = undefined;
    }
  }

  public die(): void {
    if (this.statuses.includes("immortal")) return;

    this.isDead = true;
    this.characterMovement.block();
    this.timeToDeath = 10;
  }

  public override onUpdate(deltaTime: number): void {
    // Mana regeneration
    if (this.mana.current < this.mana.max) this.mana.current += 2 * deltaTime;
    // Update death timer
    if (this.isDead) {
      if (!this.timeToDeath) return;

      this.timeToDeath -= deltaTime;
      if (this.timeToDeath <= 0) {
        // GAME OVER
        // this.delete();
        this.revive();
      }
    }

    this.characterMovement.onUpdate(deltaTime);

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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (this.position.x - this.objectModel.size / 2 === 0) {
      levelManager.prevLevel();
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (this.position.x + this.objectModel.size / 2 === renderer.canvasSize.x) {
      levelManager.nextLevel();
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D) {
    RenderCharacterModel.showMana(
      ctx,
      this.position,
      this.objectModel.size,
      this.mana
    );

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
