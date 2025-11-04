import { HSLA } from '@utils/hsla';

export const UICONFIG = {
  fpsUI: 20,

  colors: {
    mana: {
      fill: new HSLA(240, 100, 55, 1),
      stroke: { color: new HSLA(0, 0, 50, 1), width: 1 },
    },
  },

  characterDescription: {
    height: 120,
    expBarHeight: 20,
    section: {
      mainValue: { fontSize: 26 },
      description: { fontSize: 14 },
      upgradeHint: { fontSize: 14 },
      useSkillHint: { fontSize: 16 },
    },
  },
} as const;
