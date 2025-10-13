import { HSLA } from '../../core/utils/hsla';

export const ENEMYSPEEDREDUCTIONCONFIG = {
  color: { hue: 0 },
  energySteals: 12,
  size: 50,

  auraRadius: 225,
  auraColor: new HSLA(0, 50, 50, 0.3),
} as const;
