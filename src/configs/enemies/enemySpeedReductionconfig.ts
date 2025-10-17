import { HSLA } from '../../core/utils/hsla';

export const ENEMYSPEEDREDUCTIONCONFIG = {
  color: new HSLA(0, 100, 50, 1),
  slowRatio: 0.6,
  size: 50,

  auraRadius: 225,
  auraColor: new HSLA(0, 50, 50, 0.3),
} as const;
