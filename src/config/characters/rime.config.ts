import { HSLA } from '@utils/hsla';

export const RIMECONFIG = {
  color: {
    default: new HSLA(230, 85, 50, 1),
  },
  radius: 23,

  fistSpell: {
    energyUsage: 10,
    cooldown: 0.2,
    distance: [160, 200, 240, 280, 320],
  },
  secondSpell: {
    energyUsage: 30,
    cooldown: 0.5,
    freezeTime: [1, 1.25, 1.5, 1.75, 2],
    radius: [150, 180, 220, 260, 300],
    rangeColor: new HSLA(200, 100, 50, 0.2),
  },
} as const;
