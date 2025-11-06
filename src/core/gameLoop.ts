import { GameCollision } from './collision/GameCollision';
import { gameObjectManager, renderer, time, uiRenderer, userInput } from './global';

import { GAMECONFIG } from '@config/game.config';
import { UICONFIG } from '@config/ui.config';

/** Главный цикл игры */
export class GameLoop {
  private _lastGameRenderTimestamp: number | null = null;
  private _lastUIRenderTimestamp: number | null = null;
  private _animationId: number | null = null;
  private readonly _loopBound: (timestamp: number) => void;

  constructor() {
    // Привязываем метод один раз — это позволяет безопасно передавать его в rAF и отменять
    this._loopBound = this.loop.bind(this);
  }

  /**
   * Запускает цикл. Если уже запущен — no-op.
   */
  public start(): void {
    // Если уже запущено, ничего не делаем
    if (this._animationId != null) return;

    // Даем rAF передать первый timestamp в loop
    this._animationId = requestAnimationFrame(this._loopBound);
  }

  /**
   * Останавливает цикл и очищает состояние времени.
   */
  public stop(): void {
    if (this._animationId !== null) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
      this._lastGameRenderTimestamp = null;
      this._lastUIRenderTimestamp = null;
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
    this._animationId = requestAnimationFrame(this._loopBound);
  }

  private renderGame(timestamp: number): void {
    const frameTime = 1 / GAMECONFIG.fpsGame;

    // ====== Инициализируем lastRender при первом кадре ======
    if (this._lastGameRenderTimestamp === null) {
      this._lastGameRenderTimestamp = timestamp - frameTime;
    }

    // ====== deltaTime в секундах ======
    const deltaTime = (timestamp - this._lastGameRenderTimestamp) / 1000;

    // ====== FPS Limitation ======
    if (deltaTime < frameTime) return;

    // ====== обновления состояния ======
    time.beforeAllUpdates(deltaTime);
    gameObjectManager.updateAll();
    userInput.afterUpdate();
    GameCollision.clearCollisions();

    // ====== рендер игровых объектов ======
    renderer.renderFrame(ctx => gameObjectManager.renderAll(ctx));

    this._lastGameRenderTimestamp = timestamp;
  }

  private renderUI(timestamp: number): void {
    const frameTime = 1 / UICONFIG.fpsUI;

    // ====== Инициализируем lastRender при первом кадре ======
    if (this._lastUIRenderTimestamp === null) {
      this._lastUIRenderTimestamp = timestamp - frameTime;
    }

    // ====== deltaTime в секундах ======
    const deltaTime = (timestamp - this._lastUIRenderTimestamp) / 1000;

    // ====== FPS Limitation ======
    if (deltaTime < frameTime) return;

    uiRenderer.render();

    this._lastUIRenderTimestamp = timestamp;
  }
}
