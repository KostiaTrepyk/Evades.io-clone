import { Character } from './objects/character/character';
import { gameloop, levelManager, renderer, userInput } from './core/global';
import { Magmax } from './objects/characters/magmax/magmax';
import { Rime } from './objects/characters/rime/rime';

export class Game {
  private character: Character;

  constructor() {
    this.character = new Rime(
      { x: renderer.canvasSize.x / 2, y: renderer.canvasSize.y / 2 },
      46
    );
  }

  start() {
    renderer.init();
    userInput.bind();

    this.character.create();
    levelManager.start();

    window.addEventListener('blur', () => {
      gameloop.stop();
    });

    window.addEventListener('focus', () => {
      gameloop.start();
    });

    gameloop.start();
  }
}
