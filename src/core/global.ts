import { Game } from '../Game';
import { UIRenderer } from '../ui/UIRenderer';
import { GameLoop } from './GameLoop';
import { GameObjectManager } from './GameObjectManager';
import { UserInput } from './UserInput';
import { Renderer } from './Renderer';
import { CameraController } from './CameraController';
import { Time } from './Time';
import { LevelGenerator } from './GameMap/LevelGenerator/LevelGenerator';

const time = new Time();
const userInput = new UserInput();
const gameObjectManager = new GameObjectManager();
const camera = new CameraController();
const uiRenderer = new UIRenderer();
const renderer = new Renderer(camera);
const gameLoop = new GameLoop();
const levelGenerator = new LevelGenerator();

const game = new Game();

export {
  gameLoop,
  userInput,
  renderer,
  gameObjectManager,
  uiRenderer,
  time,
  game,
  levelGenerator,
};
