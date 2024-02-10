import { Character } from "./character/character";
import { Enemy } from "./enemy/enemy";
import { gameloop, renderer } from "./core/global";

export class Game {
  private character = new Character({ x: 0, y: 0 });
  private enemy = new Enemy({ x: 100, y: 0 });

  constructor() {}

  start() {
    renderer.init();

    this.character.create();
    this.enemy.create();

    gameloop.start(0);
  }
}
