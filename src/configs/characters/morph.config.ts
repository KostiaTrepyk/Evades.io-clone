import { HSLA } from '../../core/utils/hsla';

export const MORPHCONFIG = {
  color: {
    default: new HSLA(110, 75, 50, 1),
  },
  radius: 23,

  firstSpell: {
    energyUsage: 15,
    duration: 1,
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
    projectileSize: 42,
    projectileColor: new HSLA(110, 75, 50, 1),
  },

  secondSpell: {
    energyUsage: 15,
    duration: 2,
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
    projectileSize: 42,
    projectileColor: new HSLA(200, 75, 50, 1),
  },
} as const;
