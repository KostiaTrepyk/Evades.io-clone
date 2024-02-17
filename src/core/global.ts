import { Game } from "../Game";
import { UIRenderer } from "../ui/UIRenderer";
import { GameLoop } from "./GameLoop";
import { GameObjectManager } from "./GameObjectManager";
import { LevelManager } from "./Level/LevelManager";
import { Renderer } from "./Renderer";
import { CameraController } from "./camera.controller";

const gameloop = new GameLoop();
const renderer = new Renderer();
const gameObjectManager = new GameObjectManager();
const camera = new CameraController();
const game = new Game();
const levelManager = new LevelManager()
const uiRenderer = new UIRenderer()

export { gameloop, renderer, gameObjectManager, camera, game, levelManager, uiRenderer };
