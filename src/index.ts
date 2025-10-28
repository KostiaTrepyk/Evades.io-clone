import { gameMap } from './configs/GameMap/GameMapConfiguration';
import { game } from './core/global';

window.onload = main;

function main() {
  game.init();

  // DELETE ME Чисто для тестов. Фаст тревел по картах.
  window.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyM') gameMap.nextLevel();
    if (code === 'KeyN') gameMap.prevLevel();
  });

  // !!!FIX ME Пауза и старт когда ALT+Tab. В теории может запускать игру когда нам это не нужно
  window.addEventListener('blur', () => {
    game.pause();
  });

  window.addEventListener('focus', () => {
    game.resume();
  });
}
