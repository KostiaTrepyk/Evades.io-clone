import { HSLA } from '@utils/hsla';

export const ENEMYSPEEDREDUCTIONCONFIG = {
  color: new HSLA(0, 100, 50, 1),
  slowRatio: 0.6,
  radius: 25,

  auraRadius: 225,
  auraColor: new HSLA(0, 50, 50, 0.3),
} as const;
