import { gameMap } from '@config/GameMap/GameMapConfiguration';
import { renderer, userInput, gameLoop } from '@core/global';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import { Morph } from '@game/objects/characters/morph/morph';

export class Game {
  public readonly Character: CharacterBase;

  constructor() {
    this.Character = new Morph({
      x: renderer.canvasSize.width / 2,
      y: renderer.canvasSize.height / 2,
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
