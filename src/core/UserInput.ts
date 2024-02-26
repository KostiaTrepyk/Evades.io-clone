/** Createed only for hints. */
export type KeyCode =
  | 'KeyW'
  | 'KeyA'
  | 'KeyS'
  | 'KeyD'
  | 'KeyJ'
  | 'KeyK'
  | 'ShiftLeft';

export class UserInput {
  private keydown: Set<string>;
  private keyup: Set<string>;
  private keypress: Set<string>;

  constructor() {
    this.keydown = new Set();
    this.keyup = new Set();
    this.keypress = new Set();
  }

  public bind() {
    document.addEventListener(
      'keydown',
      this.keydownEventHandler.bind(this),
      false
    );
    document.addEventListener(
      'keyup',
      this.keyupEventHandler.bind(this),
      false
    );
  }

  public unbind() {
    document.removeEventListener(
      'keydown',
      this.keydownEventHandler.bind(this),
      false
    );
    document.removeEventListener(
      'keyup',
      this.keyupEventHandler.bind(this),
      false
    );

    this.keydown = new Set<string>();
    this.keypress = new Set<string>();
    this.keyup = new Set<string>();
  }

  public isKeypress(key: KeyCode): boolean {
    return this.keypress.has(key);
  }

  public isKeydown(key: KeyCode): boolean {
    return this.keydown.has(key);
  }

  public isKeyup(key: KeyCode): boolean {
    return this.keyup.has(key);
  }

  public afterUpdate(): void {
    this.keydown.clear();
    this.keyup.clear();
  }

  private keydownEventHandler(event: KeyboardEvent): void {
    const { code, repeat } = event;

    if (repeat) return;

    this.keydown.add(code);
    this.keypress.add(code);
  }

  private keyupEventHandler(event: KeyboardEvent): void {
    const { code } = event;

    this.keyup.add(code);
    this.keypress.delete(code);
  }
}
