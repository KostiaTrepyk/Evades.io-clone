import { Game } from "./Game";

window.onload = init;

function init(e: Event) {
  const game = new Game();

  game.start();

  /* 
    setTimeout(() => {
      game.pause();
    }, 2000);

    setTimeout(() => {
      game.start();
    }, 5000); 
  */
}
