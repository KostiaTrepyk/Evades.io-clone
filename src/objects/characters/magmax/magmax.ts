import { HSLA } from "../../../core/helpers/hsla";
import { Position } from "../../../core/types/Position";
import { Character } from "../../character/character";

export class Magmax extends Character {
  private spells = {
    first: { manaUsage: 2, speed: [2, 4, 6, 8, 10], isActive: false },
    second: { manaUsage: 12, isActive: false },
  };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, new HSLA(0, 85, 50, 100));
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
    if (this.spells.first.isActive) this.spells.first.isActive = false;
    else {
      this.spells.first.isActive = true;
      this.spells.second.isActive = false;
    }
  }

  public secondSpell() {
    if (this.spells.second.isActive) this.spells.second.isActive = false;
    else {
      this.spells.second.isActive = true;
      this.spells.first.isActive = false;
    }
  }

  public override onUpdate(deltaTime: number): void {
    const { first, second } = this.spells;

    if (first.isActive && this.canActivateSpell("first", deltaTime)) {
      this.applySpeedBoost(deltaTime);
    } else if (second.isActive && this.canActivateSpell("second", deltaTime)) {
      this.applyImmortality(deltaTime);
    } else {
      this.spells.first.isActive = false;
      this.spells.second.isActive = false;
      this.characterMovement.currentSpeed = this.characterMovement.defaultSpeed;
      this.statuses = this.statuses.filter((status) => status !== "immortal");
      this.statuses = this.statuses.filter((status) => status !== "speedBoost");
    }

    super.onUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);
  }

  private toggleSpell(spellType: "first" | "second") {
    if (this.spells[spellType].isActive) this.activateSpell(spellType);
    else this.deactivateSpell(spellType);
  }

  private activateSpell(spellType: "first" | "second") {
    const otherSpell = spellType === "first" ? "second" : "first";
    this.spells[spellType].isActive = !this.spells[spellType].isActive;
    this.spells[otherSpell].isActive = false;
  }

  private deactivateSpell(spellType: "first" | "second") {
    this.spells[spellType].isActive = false;
  }

  private canActivateSpell(
    spellType: "first" | "second",
    deltaTime: number
  ): boolean {
    return (
      this.energy.current > this.spells[spellType].manaUsage * deltaTime &&
      !this.isDead &&
      this.level.upgrades.firstSpell > 0
    );
  }

  private applySpeedBoost(deltaTime: number) {
    this.characterMovement.currentSpeed =
      this.characterMovement.defaultSpeed +
      this.spells.first.speed[this.level.upgrades.firstSpell - 1] * 60;
    this.energy.current -= this.spells.first.manaUsage * deltaTime;
    this.statuses.push("speedBoost");
  }

  private applyImmortality(deltaTime: number) {
    this.energy.current -= this.spells.second.manaUsage * deltaTime;
    this.characterMovement.currentSpeed = 0;
    this.statuses.push("immortal");
  }
}
