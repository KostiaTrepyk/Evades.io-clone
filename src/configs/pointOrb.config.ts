import { HSLA } from '../core/utils/hsla';

export const POINTORBCONFIG = {
  size: 30,
  colors: [
    new HSLA(22, 85, 76, 1),
    new HSLA(120, 85, 76, 1),
    new HSLA(195, 85, 76, 1),
    new HSLA(350, 85, 76, 1),
  ],
  onErrorColor: new HSLA(0, 100, 75, 1),
} as const;
