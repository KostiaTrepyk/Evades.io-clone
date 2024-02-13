import { Character } from "./objects/character/character";
import { gameloop, levelManager, renderer } from "./core/global";

export class Game {
  private character: Character;

  constructor() {
    this.character = new Character(
      { x: renderer.canvasSize.x / 2, y: renderer.canvasSize.y / 2 },
      40
    );
  }

  start() {
    renderer.init();

    this.character.create();
    levelManager.start();

    gameloop.start(0);
  }
}
