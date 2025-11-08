import { HSLA } from '@utils/hsla';

export const CHARACTERCONFIG = {
  timeToDeath: 3,
  characteristics: {
    default: {
      speed: 5,
      energy: { max: 30, regeneration: 2 },
    },
    upgradesPerLevel: {
      firstLevel: 1,
      secondLevel: 1,
      speed: 1,
      energy: { max: 5, regeneration: 0.2 },
    },
    maxUpgradeLevels: {
      firstLevel: 5,
      secondLevel: 5,
      speed: 15,
      energy: { max: 42, regeneration: 25 },
    },
  },

  dead: {
    text: {
      color: new HSLA(0, 0, 10, 1),
      size: 25,
      isBold: false,
    },
  },
} as const;
