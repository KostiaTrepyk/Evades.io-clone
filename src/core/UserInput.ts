/** Created only for hints. */
export type KeyCode =
  | 'KeyW'
  | 'KeyA'
  | 'KeyS'
  | 'KeyD'
  | 'KeyJ'
  | 'KeyK'
  | 'ShiftLeft'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5';

/** FIXME Система которая позволяет легко биндить нужные клавиши.  */
export class UserInput {
  private keydown: Set<KeyCode>;
  private keyup: Set<KeyCode>;
  private keypress: Set<KeyCode>;

  constructor() {
    this.keydown = new Set();
    this.keyup = new Set();
    this.keypress = new Set();
  }

  public bind() {
    document.addEventListener('keydown', this.keydownEventHandler.bind(this));
    document.addEventListener('keyup', this.keyupEventHandler.bind(this));
  }

  public unbind() {
    document.removeEventListener(
      'keydown',
      this.keydownEventHandler.bind(this)
    );
    document.removeEventListener('keyup', this.keyupEventHandler.bind(this));

    this.keydown.clear();
    this.keypress.clear();
    this.keyup.clear();
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

  /** Очищает состояния после update */
  public afterUpdate(): void {
    this.keydown.clear();
    this.keyup.clear();
  }

  private keydownEventHandler(event: KeyboardEvent): void {
    const { code, repeat } = event;

    if (!repeat) {
      this.keydown.add(code as KeyCode);
      this.keypress.add(code as KeyCode);
    }
  }

  private keyupEventHandler(event: KeyboardEvent): void {
    const { code } = event;

    this.keyup.add(code as KeyCode);
    this.keypress.delete(code as KeyCode);
  }
}
