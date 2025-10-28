import { Character } from './objects/character/character';
import { gameMap } from './configs/GameMap/GameMapConfiguration';
import { Morph } from './objects/characters/morph/morph';
import { gameLoop, renderer, userInput } from './core/global';

export class Game {
  public readonly Character: Character;

  constructor() {
    this.Character = new Morph({
      x: renderer.canvasSize.x / 2,
      y: renderer.canvasSize.y / 2,
    });
  }

  public init(): void {
    userInput.bind();
    this.Character.init();

    renderer.init();
    gameMap.generateCurrentLevel('start');

    gameLoop.start();
  }

  public resume(): void {
    gameLoop.start();
  }

  public pause(): void {
    gameLoop.stop();
  }
}
