import { Character } from './objects/character/character';
import { gameLoop, renderer, userInput } from './core/global';
import { gameMap } from './core/GameMap/Configuration/GameMapConfiguration';
import { Rime } from './objects/characters/rime/rime';

export class Game {
  private character: Character;

  constructor() {
    this.character = new Rime(
      { x: renderer.canvasSize.x / 2, y: renderer.canvasSize.y / 2 }
    );
  }

  /** В теории запускает игру и биндит клавиши. Я так понял что он собирает игру из других классов типа: Renderer, UserInput и так дальше. */
  start() {
    renderer.init();
    userInput.bind();

    this.character.create();
    gameMap.generateCurrentLevel('start');

    // DELETE ME Чисто для тестов. Фаст тревел по картах.
    window.addEventListener('keydown', ({ code }) => {
      if (code === 'KeyM') gameMap.nextLevel();
      if (code === 'KeyN') gameMap.prevLevel();
    });

    // !!!FIX ME Пауза и старт когда ALT+Tab. В теории может запускать игру когда нам это не нужно
    window.addEventListener('blur', () => {
      gameLoop.stop();
    });

    window.addEventListener('focus', () => {
      gameLoop.start();
    });

    gameLoop.start();
  }
}
