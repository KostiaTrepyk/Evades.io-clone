import { GameLoop } from "./GameLoop";
import { GameObjectManager } from "./GameObjectManager";
import { Renderer } from "./Renderer";
import { CameraController } from "./camera.controller";

const gameloop = new GameLoop();
const renderer = new Renderer();
const gameObjectManager = new GameObjectManager();
const camera = new CameraController()

export { gameloop, renderer, gameObjectManager, camera };
