import { CHARACTERCONFIG } from '@config/characters/character.config';

export type Upgrade = {
  current: number;
  readonly max: number;
};

export class CharacterLevels {
  private _currentLevel: number;
  private _atePointOrbs: number;
  private _upgradePoints: number;
  private readonly _upgrades: {
    speed: Upgrade;
    maxEnergy: Upgrade;
    energyRegeneration: Upgrade;
    firstSpell: Upgrade;
    secondSpell: Upgrade;
  };

  constructor() {
    const maxUpgrades = CHARACTERCONFIG.characteristics.maxUpgradeLevels;

    this._currentLevel = 1;
    this._atePointOrbs = 0;
    this._upgradePoints = 100;
    this._upgrades = {
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
    this._atePointOrbs++;
    const nextLVLReq = this.levelUpReq;

    if (this._atePointOrbs >= nextLVLReq) {
      this.levelUp();
    }
  }

  private levelUp() {
    this._atePointOrbs -= this.levelUpReq;
    this._currentLevel++;
    this._upgradePoints += 1;
  }

  private handlerKeydown({ code }: KeyboardEvent): void {
    if (this._upgradePoints <= 0) return;

    if (code === 'Digit1' && this._upgrades.speed.current < this._upgrades.speed.max) {
      this._upgrades.speed.current += 1;
      this._upgradePoints -= 1;
    } else if (
      code === 'Digit2' &&
      this._upgrades.maxEnergy.current < this._upgrades.maxEnergy.max
    ) {
      this._upgrades.maxEnergy.current += 1;
      this._upgradePoints -= 1;
    } else if (
      code === 'Digit3' &&
      this._upgrades.energyRegeneration.current < this._upgrades.energyRegeneration.max
    ) {
      this._upgrades.energyRegeneration.current += 1;
      this._upgradePoints -= 1;
    } else if (
      code === 'Digit4' &&
      this._upgrades.firstSpell.current < this._upgrades.firstSpell.max
    ) {
      this._upgrades.firstSpell.current += 1;
      this._upgradePoints -= 1;
    } else if (
      code === 'Digit5' &&
      this._upgrades.secondSpell.current < this._upgrades.secondSpell.max
    ) {
      this._upgrades.secondSpell.current += 1;
      this._upgradePoints -= 1;
    }
  }

  get levelUpReq(): number {
    if (this._currentLevel < 3) return 4;
    if (this._currentLevel < 5) return 6;
    if (this._currentLevel < 10) return 10;
    if (this._currentLevel < 15) return 15;
    if (this._currentLevel < 25) return 19;
    return 22;
  }

  get upgradePoints(): number {
    return this._upgradePoints;
  }

  get currentLevel(): number {
    return this._currentLevel;
  }

  get atePointOrbs(): number {
    return this._atePointOrbs;
  }

  public get upgrades(): CharacterLevels['_upgrades'] {
    return structuredClone(this._upgrades);
  }
}
