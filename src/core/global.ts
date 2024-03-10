import { Game } from '../Game';
import { UIRenderer } from '../ui/UIRenderer';
import { GameLoop } from './GameLoop';
import { GameObjectManager } from './GameObjectManager';
import { UserInput } from './UserInput';
import { Renderer } from './Renderer';
import { CameraController } from './camera.controller';
import { Time } from './Time';

const time = new Time();
const userInput = new UserInput();
const gameObjectManager = new GameObjectManager();
const camera = new CameraController();
const uiRenderer = new UIRenderer();
const renderer = new Renderer(camera);
const gameloop = new GameLoop();

const game = new Game();

export {
  gameloop,
  userInput,
  renderer,
  gameObjectManager,
  uiRenderer,
  time,
  game,
};
