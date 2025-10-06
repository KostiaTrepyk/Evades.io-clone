import { HSLA } from '../core/utils/hsla';

export const GAMECONFIG = {
  /** When pressed SHIFT */
  characterSlowRatio: 0.5,

  fpsGame: 180,
  fpsUI: 20,

  /*   orders: {
    update: {
      player: 1,
      enemies: 3,
      portals: 4,
      projectiles: 2,
    },

    afterUpdate: {
      player: 1,
    },

    render: {
      player: 4,
      enemies: 5,
      pointOrbs: 3,
      saveZones: 1,
      portals: 2,
      projectiles: 6,
    },
  }, */

  /** UI */
  colors: {
    ui: {
      mana: {
        fill: new HSLA(240, 100, 55, 1),
        stroke: { color: new HSLA(0, 0, 50, 1), width: 1 },
      },
    },
  },
} as const;
