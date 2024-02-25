import { Game } from '../Game';
import { UIRenderer } from '../ui/UIRenderer';
import { GameLoop } from './GameLoop';
import { GameObjectManager } from './GameObjectManager';
import { UserInput } from './UserInput';
import { LevelManager } from './Level/LevelManager';
import { Renderer } from './Renderer';
import { CameraController } from './camera.controller';

const gameloop = new GameLoop();
const userInput = new UserInput();
const renderer = new Renderer();
const gameObjectManager = new GameObjectManager();
const camera = new CameraController();
const levelManager = new LevelManager();
const uiRenderer = new UIRenderer();
const game = new Game();

export {
  gameloop,
  userInput,
  renderer,
  gameObjectManager,
  camera,
  levelManager,
  uiRenderer,
  game,
};
