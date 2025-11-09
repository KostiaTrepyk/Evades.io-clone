import { Magmax } from './objects/characters/magmax/magmax';
import { Necro } from './objects/characters/necro/necro';
import { Rime } from './objects/characters/rime/rime';

import { gameMap } from '@config/GameMap/GameMapConfiguration';
import { MAGMAXCONFIG } from '@config/objects/characters/magmax.config';
import { MORPHCONFIG } from '@config/objects/characters/morph.config';
import { NECROCONFIG } from '@config/objects/characters/necro.config';
import { RIMECONFIG } from '@config/objects/characters/rime.config';
import { renderer, userInput, gameLoop } from '@core/global';
import type { CharacterBase } from '@game/objects/characterBase/characterBase';
import { Morph } from '@game/objects/characters/morph/morph';
import type { HSLA } from '@utils/hsla';

export class Game {
  public Character: CharacterBase;

  constructor() {
    this.Character = new Morph();
  }

  public init(player: CharacterBase): void {
    this.Character = player;

    this.Character.init();
    renderer.init();
    userInput.bind();

    gameMap.generateCurrentLevel('start');

    gameLoop.start();
  }

  public resume(): void {
    gameLoop.start();
  }

  public pause(): void {
    gameLoop.stop();
  }

  public get availableHeroes(): { title: string; color: HSLA; class: new () => CharacterBase }[] {
    return [
      { title: MAGMAXCONFIG.title, color: MAGMAXCONFIG.color.default, class: Magmax },
      { title: RIMECONFIG.title, color: RIMECONFIG.color.default, class: Rime },
      { title: MORPHCONFIG.title, color: MORPHCONFIG.color.default, class: Morph },
      { title: NECROCONFIG.title, color: NECROCONFIG.color.default, class: Necro },
    ];
  }
}
