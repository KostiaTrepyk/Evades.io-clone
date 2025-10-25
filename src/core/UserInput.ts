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
  private _keydown: Set<KeyCode>;
  private _keyup: Set<KeyCode>;
  private _keypress: Set<KeyCode>;

  constructor() {
    this._keydown = new Set();
    this._keyup = new Set();
    this._keypress = new Set();
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

    this._keydown.clear();
    this._keypress.clear();
    this._keyup.clear();
  }

  public isKeypress(key: KeyCode): boolean {
    return this._keypress.has(key);
  }

  public isKeydown(key: KeyCode): boolean {
    return this._keydown.has(key);
  }

  public isKeyup(key: KeyCode): boolean {
    return this._keyup.has(key);
  }

  /** Очищает состояния после update */
  public afterUpdate(): void {
    this._keydown.clear();
    this._keyup.clear();
  }

  private keydownEventHandler(event: KeyboardEvent): void {
    const { code, repeat } = event;

    if (!repeat) {
      this._keydown.add(code as KeyCode);
      this._keypress.add(code as KeyCode);
    }
  }

  private keyupEventHandler(event: KeyboardEvent): void {
    const { code } = event;

    this._keyup.add(code as KeyCode);
    this._keypress.delete(code as KeyCode);
  }
}
