import { HSLA } from '../../core/utils/hsla';

export const MORPHCONFIG = {
  color: {
    default: new HSLA(110, 75, 50, 1),
  },
  size: 46,

  firstSpell: {
    energyUsage: 15,
    cooldown: [2, 1.5, 1.2, 0.7, 0.3],
    count: [1, 2, 3, 4, 5],
    projectileSpeed: 1600,
    projectileSize: 42,
    projectileColor: new HSLA(100, 75, 50, 1),
  },
  
  secondSpell: {
    energyUsage: 15,
    cooldown: [2, 1.5, 1.2, 0.7, 0.3],
    projectileSpeed: 1600,
    projectileSize: 42,
    projectileColor: new HSLA(100, 75, 50, 1),
  },
} as const;
