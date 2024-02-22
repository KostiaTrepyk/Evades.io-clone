import { doItemsIntersect } from "../../core/doItemsIntersect";
import { GameObject } from "../../core/common/GameObject";
import { gameObjectManager } from "../../core/global";
import { Position } from "../../core/types/Position";
import { RenderCharacterModel } from "./character.model";
import { CharacterMovement } from "./character.movement";
import { CharacterLevels } from "./character.levels";
import { HSLA } from "../../core/helpers/hsla";

type Status = "immortal" | "speedBoost";

export class Character extends GameObject<"circle"> {
  public characterMovement: CharacterMovement;
  public level: CharacterLevels;
  public isDead: boolean;
  public energy: { max: number; current: number; regen: number };
  public timeToDeath: number | undefined;
  public statuses: Status[];
  public color: HSLA;

  constructor(startPsition: Position, size: number, color: HSLA) {
    super(startPsition, { shape: "circle", size });
    this.color = color;
    this.characterMovement = new CharacterMovement(this, startPsition, size);
    this.level = new CharacterLevels(this);
    this.isDead = false;
    this.energy = { max: 30, current: 30, regen: 1 };
    this.statuses = [];
  }

  public override create() {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    gameObjectManager.addGameObject(this);
    this.characterMovement.bind();
    this.level.init();
  }

  public override delete() {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    gameObjectManager.removeGameObject(this);
    this.characterMovement.unbind();
  }

  public revive(): void {
    let canBeRevived: boolean = true;
    gameObjectManager.enemies.forEach((enemy) => {
      if (doItemsIntersect(this, enemy)) {
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
    this.level.onUpdate();

    // Mana regeneration
    if (this.energy.current < this.energy.max) {
      if (this.energy.regen * deltaTime > this.energy.max) {
        this.energy.current += this.energy.max;
      }
      this.energy.current += this.energy.regen * deltaTime;
    }

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

    gameObjectManager.enemies.forEach((enemy) => {
      if (doItemsIntersect(this, enemy)) {
        if (!this.isDead) {
          this.die();
        }
      }
    });
    gameObjectManager.pointOrbs.forEach((pointOrb) => {
      if (doItemsIntersect(this, pointOrb)) {
        pointOrb.delete();
        this.level.addPointOrb();
      }
    });
  }

  public override onRender(ctx: CanvasRenderingContext2D) {
    RenderCharacterModel.showMana(ctx, this);

    if (this.isDead) {
      RenderCharacterModel.dead(ctx, this);
    } else {
      RenderCharacterModel.default(ctx, this);
    }
  }
}
