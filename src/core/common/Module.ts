export abstract class Module {
  public abstract onUpdate?(deltaTime: number): void;
  public abstract afterUpdate?(deltaTime: number): void;
}
