import { HSLA } from '../../core/utils/hsla';

export const MAGMAXCONFIG = {
  color: {
    default: new HSLA(0, 85, 50, 1),
    firstSpellActive: new HSLA(5, 85, 60, 1),
    secondSpellActive: new HSLA(0, 85, 40, 1),
  },
  size: 46,

  fistSpell: {
    speed: [2, 4, 6, 8, 10],
    energyUsagePerSecond: 4,
    cooldown: 0,
  },
  secondSpell: {
    energyUsagePerSecond: 15,
    cooldown: [2, 1.5, 1.2, 0.7, 0.3],
  },
} as const;
