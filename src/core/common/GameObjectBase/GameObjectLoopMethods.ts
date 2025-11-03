export abstract class GameObjectLoopMethods {
  /** Everything that effects movement and main logic.  */
  public abstract beforeUpdate?(): void;

  /** Movement, main logic, etc.  */
  public abstract onUpdate?(): void;

  /** Clearing states after update, processing collisions etc. */
  public abstract afterUpdate?(): void;

  /** Use to render this object. */
  public abstract onRender?(ctx: CanvasRenderingContext2D): void;
}
