export class UniqueId {
  private currentId: number;

  constructor() {
    this.currentId = 1;
  }

  public get() {
    return this.currentId++;
  }
}
