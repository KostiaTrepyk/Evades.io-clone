import { Character } from "./objects/character/character";
import { Enemy } from "./objects/enemy/enemy";
import { gameloop, renderer } from "./core/global";
import { PointOrb } from "./objects/pointOrb/PointOrb";
import { SaveZone } from "./objects/saveZone/SaveZone";

export class Game {
  private character = new Character(
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    40
  );
  private enemy = [
    new Enemy({ x: 600, y: 30 }, 30, { x: -80, y: -150 }),
    new Enemy({ x: 150, y: 500 }, 40, { x: 150, y: -50 }),
    new Enemy({ x: 300, y: 500 }, 10, { x: -51, y: 100 }),
    new Enemy({ x: 350, y: 200 }, 150, { x: 50, y: 50 }),
    new Enemy({ x: 500, y: 700 }, 100, { x: -400, y: 50 }),
    new Enemy({ x: 400, y: 500 }, 50, { x: 550, y: 50 }),
    new Enemy({ x: 500, y: 500 }, 30, { x: -150, y: -150 }),
    new Enemy({ x: 700, y: 200 }, 40, { x: 400, y: -200 }),
    new Enemy({ x: 800, y: 700 }, 20, { x: -100, y: 200 }),
    new Enemy({ x: 800, y: 850 }, 40, { x: 200, y: 700 }),
    new Enemy({ x: 900, y: 700 }, 100, { x: -40, y: 500 }),
    new Enemy({ x: 1200, y: 100 }, 40, { x: -150, y: 150 }),
  ];
  private pointOrbs = [
    new PointOrb({ x: 100, y: 250 }),
    new PointOrb({ x: 200, y: 200 }),
    new PointOrb({ x: 300, y: 220 }),
    new PointOrb({ x: 400, y: 500 }),
  ];
  private saveZones = [new SaveZone({ x: 100, y: 200 }, { x: 200, y: 400 })];

  constructor() {}

  start() {
    renderer.init();

    const objects = [
      this.character,
      ...this.enemy,
      ...this.pointOrbs,
      ...this.saveZones,
    ];

    objects.forEach((object) => object.create());

    gameloop.start(0);
  }
}
