import { CHARACTERCONFIG } from '../../configs/characters/character.config';

type Upgrade = {
  current: number;
  max: number;
};

export class CharacterLevels {
  public currentLevel: number;
  public atePointOrbs: number;
  public upgradePoints: number;
  public upgrades: {
    speed: Upgrade;
    maxEnergy: Upgrade;
    energyRegeneration: Upgrade;
    firstSpell: Upgrade;
    secondSpell: Upgrade;
  };

  constructor() {
    const maxUpgrades = CHARACTERCONFIG.characteristics.maxUpgradeLevels;

    this.currentLevel = 1;
    this.atePointOrbs = 0;
    this.upgradePoints = 100;
    this.upgrades = {
      speed: { current: 0, max: maxUpgrades.speed },
      maxEnergy: { current: 0, max: maxUpgrades.energy.max },
      energyRegeneration: { current: 0, max: maxUpgrades.energy.regeneration },
      firstSpell: { current: 0, max: maxUpgrades.firstLevel },
      secondSpell: { current: 0, max: maxUpgrades.secondLevel },
    };
  }

  public init() {
    window.addEventListener('keydown', this.handlerKeydown.bind(this), false);
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
    this.upgradePoints += 1;
  }

  public levelUpReq(): number {
    if (this.currentLevel < 3) return 4;
    if (this.currentLevel < 5) return 6;
    if (this.currentLevel < 10) return 10;
    if (this.currentLevel < 15) return 15;
    if (this.currentLevel < 25) return 19;
    return 22;
  }

  private handlerKeydown({ code }: KeyboardEvent): void {
    if (this.upgradePoints <= 0) return;

    if (
      code === 'Digit1' &&
      this.upgrades.speed.current < this.upgrades.speed.max
    ) {
      this.upgrades.speed.current += 1;
      this.upgradePoints -= 1;
    } else if (
      code === 'Digit2' &&
      this.upgrades.maxEnergy.current < this.upgrades.maxEnergy.max
    ) {
      this.upgrades.maxEnergy.current += 1;
      this.upgradePoints -= 1;
    } else if (
      code === 'Digit3' &&
      this.upgrades.energyRegeneration.current <
        this.upgrades.energyRegeneration.max
    ) {
      this.upgrades.energyRegeneration.current += 1;
      this.upgradePoints -= 1;
    } else if (
      code === 'Digit4' &&
      this.upgrades.firstSpell.current < this.upgrades.firstSpell.max
    ) {
      this.upgrades.firstSpell.current += 1;
      this.upgradePoints -= 1;
    } else if (
      code === 'Digit5' &&
      this.upgrades.secondSpell.current < this.upgrades.secondSpell.max
    ) {
      this.upgrades.secondSpell.current += 1;
      this.upgradePoints -= 1;
    }
  }
}
