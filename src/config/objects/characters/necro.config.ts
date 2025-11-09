import { HSLA } from '@utils/hsla';

export const NECROCONFIG = {
  title: 'Necro',
  radius: 23,
  color: {
    default: new HSLA(300, 85, 50, 1),
  },

  firstSpell: {
    energyUsage: 15,
    cooldown: [2, 1.5, 1.2, 0.7, 0.3],
    projectiles: [
      [{ x: 1, y: 0 }],
      [
        { x: 0.8, y: 0.2 },
        { x: 0.8, y: -0.2 },
      ],
      [
        { x: 0.7, y: 0.3 },
        { x: 0.8, y: 0 },
        { x: 0.7, y: -0.3 },
      ],
      [
        { x: 0.65, y: 0.35 },
        { x: 0.85, y: 0.15 },
        { x: 0.85, y: -0.15 },
        { x: 0.65, y: -0.35 },
      ],
      [
        { x: 0.6, y: 0.4 },
        { x: 0.8, y: 0.2 },
        { x: 0.88, y: 0 },
        { x: 0.8, y: -0.2 },
        { x: 0.6, y: -0.4 },
      ],
    ] as { x: number; y: number }[][],
    projectileSpeed: 28,
    projectileRadius: 22,
    projectileColor: new HSLA(300, 75, 50, 1),
  },

  secondSpell: {
    energyUsage: 0,
    // Can not be less than 60. Because then player will be immortal.
    cooldown: [180, 150, 130, 110, 90],
  },
} as const;
