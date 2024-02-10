import { GameLoop } from "./GameLoop";
import { GameObjectsManager } from "./GameObjectsManager";
import { Renderer } from "./Renderer";

const gameloop = new GameLoop();
const renderer: Renderer = new Renderer();
const gameObjectsManager = new GameObjectsManager();

export { gameloop, renderer, gameObjectsManager };
