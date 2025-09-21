import {
  gameObjectManager,
  renderer,
  time,
  uiRenderer,
  userInput,
} from './global';

/** Главный цикл игры */
export class GameLoop {
  private lastRender: number | null = null;
  private animationId: number | null = null;
  private readonly loopBound: (timestamp: number) => void;

  constructor() {
    // Привязываем метод один раз — это позволяет безопасно передавать его в rAF и отменять
    this.loopBound = this.loop.bind(this);
  }

  /**
   * Запускает цикл. Если уже запущен — no-op.
   */
  public start(): void {
    // Если уже запущено, ничего не делаем
    if (this.animationId != null) return;

    // Даем rAF передать первый timestamp в loop
    this.animationId = requestAnimationFrame(this.loopBound);
  }

  /**
   * Останавливает цикл и очищает состояние времени.
   */
  public stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.lastRender = null;
  }

  /**
   * Внутренний кадр (вызывается requestAnimationFrame).
   * @param timestamp - DOMHighResTimeStamp, предоставляемый rAF (в ms).
   */
  private loop(timestamp: number): void {
    // Инициализируем lastRender при первом кадре
    if (this.lastRender === null) {
      this.lastRender = timestamp;
    }

    // deltaTime в секундах
    const frameTime = (timestamp - this.lastRender) / 1000;

    // render
    this.render(frameTime);

    // Подготовка к следующему кадру
    this.lastRender = timestamp;
    this.animationId = requestAnimationFrame(this.loopBound);
  }

  private render(frameTime: number): void {
    // ====== обновления состояния ======
    time.onUpdate(frameTime);
    gameObjectManager.updateAll(frameTime);
    userInput.afterUpdate();

    // ====== рендер игровых объектов ======
    renderer.renderFrame((ctx) => gameObjectManager.renderAll(ctx));

    // ====== UI ======
    uiRenderer.render();
  }
}
