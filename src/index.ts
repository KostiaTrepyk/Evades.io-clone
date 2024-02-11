import { Game } from "./Game";

window.onload = init;

function init(e: Event) {
  const game = new Game();

  game.start();
}
