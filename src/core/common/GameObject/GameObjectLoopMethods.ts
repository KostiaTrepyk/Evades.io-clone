export abstract class GameObjectLoopMethods {
  /** Everything that effects movement and main logic.  */
  public abstract beforeUpdate?(deltaTime: number): void;

  /** Movement, main logic, etc.  */
  public abstract onUpdate?(deltaTime: number): void;

  /** Clearing states after update, processing collisions etc. */
  public abstract afterUpdate?(deltaTime: number): void;

  /** Use to render this object. */
  public abstract onRender?(ctx: CanvasRenderingContext2D): void;
}
