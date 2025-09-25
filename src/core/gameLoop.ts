import { gameConfig } from '../configs/game.config';
import {
  gameObjectManager,
  renderer,
  time,
  uiRenderer,
  userInput,
} from './global';

/** Главный цикл игры */
export class GameLoop {
  private lastGameRenderTimestamp: number | null = null;
  private lastUIRenderTimestamp: number | null = null;
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
      this.lastGameRenderTimestamp = null;
      this.lastUIRenderTimestamp = null;
    }
  }

  /**
   * Внутренний кадр (вызывается requestAnimationFrame).
   * @param timestamp - DOMHighResTimeStamp, предоставляемый rAF (в ms).
   */
  private loop(timestamp: number): void {
    // render
    this.renderGame(timestamp);
    this.renderUI(timestamp);

    // Подготовка к следующему кадру
    this.animationId = requestAnimationFrame(this.loopBound);
  }

  private renderGame(timestamp: number): void {
    const frameTime = 1 / gameConfig.fpsGame;

    // ====== Инициализируем lastRender при первом кадре ======
    if (this.lastGameRenderTimestamp === null) {
      this.lastGameRenderTimestamp = timestamp - frameTime;
    }

    // ====== deltaTime в секундах ======
    const deltaTime = (timestamp - this.lastGameRenderTimestamp) / 1000;

    // ====== FPS Limitation ======
    if (deltaTime < frameTime) return;

    // ====== обновления состояния ======
    time.onUpdate(timestamp);
    gameObjectManager.updateAll(deltaTime);
    userInput.afterUpdate();

    // ====== рендер игровых объектов ======
    renderer.renderFrame((ctx) => gameObjectManager.renderAll(ctx));

    this.lastGameRenderTimestamp = timestamp;
  }

  private renderUI(timestamp: number): void {
    const frameTime = 1 / gameConfig.fpsUI;

    // ====== Инициализируем lastRender при первом кадре ======
    if (this.lastUIRenderTimestamp === null) {
      this.lastUIRenderTimestamp = timestamp - frameTime;
    }

    // ====== deltaTime в секундах ======
    const deltaTime = (timestamp - this.lastUIRenderTimestamp) / 1000;

    // ====== FPS Limitation ======
    if (deltaTime < frameTime) return;

    uiRenderer.render();

    this.lastUIRenderTimestamp = timestamp;
  }
}
