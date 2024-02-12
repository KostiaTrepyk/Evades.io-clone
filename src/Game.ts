import { Character } from "./objects/character/character";
import { gameloop, renderer } from "./core/global";
import { generateLevel } from "./core/Level/LevelGenerator";

export class Game {
  private character: Character;

  constructor() {
    this.character = new Character(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      40
    );
  }

  start() {
    renderer.init();

    this.character.create();
    generateLevel({
      enemyCount: 50,
      pointOrbCount: 70,
      difficulty: 2,
      enemySize: { min: 40, max: 80 },
    });

    gameloop.start(0);
  }
}
