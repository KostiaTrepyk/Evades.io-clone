import { characterSpeedPerPoint } from "../../consts/consts";
import { Character } from "./character";

export class CharacterLevels {
  public player: Character;
  public currentLevel: number;
  public atePointOrbs: number;
  public points: number;
  public upgrades: {
    speed: number;
    maxEnergy: number;
    regen: number;
    firstSpell: number;
    secondSpell: number;
  };

  constructor(player: Character) {
    this.player = player;
    this.currentLevel = 1;
    this.atePointOrbs = 0;
    this.points = 50;
    this.upgrades = {
      speed: 0,
      maxEnergy: 0,
      regen: 0,
      firstSpell: 0,
      secondSpell: 0,
    };
  }

  public init() {
    window.addEventListener("keydown", this.handlerKeydown.bind(this), false);
  }

  public addPointOrb() {
    this.atePointOrbs++;
    const nextLVLReq = this.levelUpReq();

    if (this.atePointOrbs >= nextLVLReq) {
      this.levelUp();
    }
  }

  public levelUp() {
    this.atePointOrbs -= this.levelUpReq();
    this.currentLevel++;
    this.points += 1;
  }

  public levelUpReq(): number {
    if (this.currentLevel < 3) return 4;
    if (this.currentLevel < 5) return 6;
    if (this.currentLevel < 10) return 10;
    return 16;
  }

  private handlerKeydown({ code }: KeyboardEvent): void {
    if (this.points <= 0) return;

    if (code === "Digit1" && this.upgrades.speed < 15) {
      this.upgrades.speed += 1;
      this.points -= 1;
    } else if (code === "Digit2" && this.upgrades.maxEnergy < 42) {
      this.upgrades.maxEnergy += 1;
      this.points -= 1;
    } else if (code === "Digit3" && this.upgrades.regen < 30) {
      this.upgrades.regen += 1;
      this.points -= 1;
    } else if (code === "Digit4" && this.upgrades.firstSpell < 5) {
      this.upgrades.firstSpell += 1;
      this.points -= 1;
    } else if (code === "Digit5" && this.upgrades.secondSpell < 5) {
      this.upgrades.secondSpell += 1;
      this.points -= 1;
    }
  }

  public onUpdate() {
    this.player.characterMovement.defaultSpeed =
      (5 + 1 * this.upgrades.speed) * characterSpeedPerPoint;
    this.player.energy.max = 30 + 5 * this.upgrades.maxEnergy;
    this.player.energy.regen = 1 + 0.2 * this.upgrades.regen;
  }
}
