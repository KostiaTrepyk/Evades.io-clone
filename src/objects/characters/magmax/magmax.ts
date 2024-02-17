import { Position } from "../../../core/types/Position";
import { Character } from "../../character/character";
import { RenderMagmaxModel } from "./magmax.model";

export class Magmax extends Character {
  public isFirstSpellActive: boolean;
  public isSecondSpellActive: boolean;

  constructor(startPosition: Position, size: number) {
    super(startPosition, size);
    this.isFirstSpellActive = false;
    this.isSecondSpellActive = false;
  }

  public override create(): void {
    super.create();
    window.addEventListener("keydown", this.keydownHandler.bind(this));
  }

  public override delete(): void {
    super.delete();
    window.removeEventListener("keydown", this.keydownHandler.bind(this));
  }

  private keydownHandler(e: KeyboardEvent) {
    if (e.code === "KeyJ") {
      this.firstSpell();
    } else if (e.code === "KeyK") {
      this.secondSpell();
    }
  }

  public firstSpell() {
    if (this.isSecondSpellActive) this.isSecondSpellActive = false;

    if (this.isFirstSpellActive) this.isFirstSpellActive = false;
    else this.isFirstSpellActive = true;
  }

  public secondSpell() {
    if (this.isFirstSpellActive) this.isFirstSpellActive = false;

    if (this.isSecondSpellActive) this.isSecondSpellActive = false;
    else this.isSecondSpellActive = true;
  }

  public override onUpdate(deltaTime: number): void {
    const firstSpellManaUsage = 2;
    const secondSpellManaUsage = 12;

    if (
      this.isFirstSpellActive &&
      this.mana.current > firstSpellManaUsage * deltaTime &&
      !this.isDead
    ) {
      this.characterMovement.currentSpeed =
        this.characterMovement.defaultSpeed + 300;
      this.mana.current -= firstSpellManaUsage * deltaTime;
    } else if (
      this.isSecondSpellActive &&
      this.mana.current > secondSpellManaUsage * deltaTime &&
      !this.isDead
    ) {
      this.mana.current -= secondSpellManaUsage * deltaTime;
      this.characterMovement.currentSpeed = 0;
      this.statuses.push("immortal");
    } else {
      this.isFirstSpellActive = false;
      this.isSecondSpellActive = false;
      this.characterMovement.currentSpeed = this.characterMovement.defaultSpeed;
      this.statuses = this.statuses.filter((status) => status !== "immortal");
    }

    super.onUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderMagmaxModel.showMana(
      ctx,
      this.position,
      this.objectModel.size,
      this.mana
    );
    if (this.isDead && this.timeToDeath)
      RenderMagmaxModel.dead(
        ctx,
        this.position,
        this.objectModel.size,
        this.timeToDeath
      );
    else
      RenderMagmaxModel.default(ctx, this.position, this.objectModel.size, {
        isFirstSpellActive: this.isFirstSpellActive,
        isSecondSpellActive: this.isSecondSpellActive,
      });
  }
}
