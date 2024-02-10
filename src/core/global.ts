import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";

const gameloop = new GameLoop();
const renderer: Renderer = new Renderer();

export { gameloop, renderer };
