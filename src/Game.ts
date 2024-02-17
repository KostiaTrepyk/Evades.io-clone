import { Character } from "./objects/character/character";
import { gameloop, levelManager, renderer } from "./core/global";
import { Magmax } from "./objects/characters/magmax";

export class Game {
  private character: Character;

  constructor() {
    this.character = new Magmax(
      { x: renderer.canvasSize.x / 2, y: renderer.canvasSize.y / 2 },
      46
    );
  }

  start() {
    renderer.init();

    this.character.create();
    levelManager.start();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    window.addEventListener("blur", () => {
      gameloop.stop();
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    window.addEventListener("focus", () => {
      gameloop.start();
    });

    gameloop.start();
  }
}
