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
      this.toggleSpell("first");
    } else if (e.code === "KeyK") {
      this.toggleSpell("second");
    }
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    const { first, second } = this.spells;

    if (first.isActive && this.canActivateSpell("first", deltaTime)) {
      this.applySpeedBoost(deltaTime);
    } else if (second.isActive && this.canActivateSpell("second", deltaTime)) {
      this.applyImmortality(deltaTime);
    } else {
      this.spells.first.isActive = false;
      this.spells.second.isActive = false;
    }
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);
  }

  private toggleSpell(spellType: "first" | "second") {
    if (!this.spells[spellType].isActive) this.activateSpell(spellType);
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
      this.characteristics.energy.current >
        this.spells[spellType].manaUsage * deltaTime &&
      !this.isDead &&
      this.level.upgrades.firstSpell.current > 0
    );
  }

  private applySpeedBoost(deltaTime: number) {
    this.characteristics.applyEffect(
      {
        speed:
          this.spells.first.speed[this.level.upgrades.firstSpell.current - 1],
      },
      "speedBoost"
    );
    this.characteristics.energy.current -=
      this.spells.first.manaUsage * deltaTime;
  }

  private applyImmortality(deltaTime: number) {
    this.characteristics.energy.current -=
      this.spells.second.manaUsage * deltaTime;
    this.characteristics.applyEffect({ speed: -9999 }, "immortal");
  }
}
