const lvlReq: Record<string, number> = {
  1: 0,
  2: 8,
  3: 10,
  4: 14,
  5: 20,
  6: 30,
  7: 40,
  8: 45,
  9: 50,
  10: 60,
};

export class LVLSystem {
  public currentlvl: number;
  public atePointOrbs: number;

  constructor() {
    this.currentlvl = 1;
    this.atePointOrbs = 0;
  }

  public addPointOrb() {
    this.atePointOrbs++;
    const nextLVLReq = lvlReq[this.currentlvl + 1];

    if (this.atePointOrbs >= nextLVLReq) {
      this.atePointOrbs -= nextLVLReq;
      this.currentlvl++;
    }
  }
}
