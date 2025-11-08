import { CameraController } from './CameraController';
import { GameLoop } from './GameLoop';
import { LevelGenerator } from './GameMap/LevelGenerator/LevelGenerator';
import { GameObjectManager } from './GameObjectManager';
import { Renderer } from './Renderer';
import { Time } from './Time';
import { UserInput } from './UserInput';

import { GameMenu } from '@core/GameMenu/GameMenu';
import { UIRenderer } from '@core/ui/UIRenderer';
import { Game } from '@game/Game';

const time = new Time();
const userInput = new UserInput();
const gameObjectManager = new GameObjectManager();
const cameraController = new CameraController();
const uiRenderer = new UIRenderer();
const renderer = new Renderer(cameraController);
const gameLoop = new GameLoop();
const levelGenerator = new LevelGenerator(gameObjectManager, renderer);

const game = new Game();
const gameMenu = new GameMenu();

export {
  gameLoop,
  userInput,
  renderer,
  gameObjectManager,
  uiRenderer,
  time,
  game,
  levelGenerator,
  gameMenu,
};
