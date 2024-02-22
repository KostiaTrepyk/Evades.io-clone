export class HSLA {
  private hue: number;
  private saturation: number;
  private lightness: number;
  private alpha: number;

  constructor(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number
  ) {
    this.hue = this.clampValue(hue, 0, 360);
    this.saturation = this.clampValue(saturation, 0, 100);
    this.lightness = this.clampValue(lightness, 0, 100);
    this.alpha = this.clampValue(alpha, 0, 1);
  }

  public static fromString(colorString: string): HSLA {
    const [hue, saturation, light, alpha] = colorString
      .substring(5, colorString.length - 1)
      .split(",")
      .map((value) => parseFloat(value.trim()));

    return new HSLA(hue, saturation, light, alpha);
  }

  public toString(): string {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
  }

  public clone(): HSLA {
    return new HSLA(this.hue, this.saturation, this.lightness, this.alpha);
  }

  static fromRGBA(r: number, g: number, b: number, a: number): HSLA {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    const cMax = Math.max(normalizedR, normalizedG, normalizedB);
    const cMin = Math.min(normalizedR, normalizedG, normalizedB);
    const delta = cMax - cMin;

    let hue = 0;
    if (delta !== 0) {
      switch (cMax) {
        case normalizedR:
          hue =
            ((normalizedG - normalizedB) / delta +
              (normalizedG < normalizedB ? 6 : 0)) *
            60;
          break;
        case normalizedG:
          hue = ((normalizedB - normalizedR) / delta + 2) * 60;
          break;
        case normalizedB:
          hue = ((normalizedR - normalizedG) / delta + 4) * 60;
          break;
      }
    }

    const light = (cMax + cMin) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));

    return new HSLA(
      Math.round(hue),
      Math.round(saturation * 100),
      Math.round(light * 100),
      a
    );
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  get getHue(): number {
    return this.hue;
  }

  get getSaturation(): number {
    return this.saturation;
  }

  get getLightness(): number {
    return this.lightness;
  }

  get getAlpha(): number {
    return this.alpha;
  }

  set setHue(hue: number) {
    this.hue = this.clampValue(hue, 0, 360);
  }
  set setSaturation(saturation: number) {
    this.saturation = this.clampValue(saturation, 0, 100);
  }
  set setLightness(lightness: number) {
    this.lightness = this.clampValue(lightness, 0, 100);
  }
  set setAlpha(alpha: number) {
    this.alpha = this.clampValue(alpha, 0, 1);
  }
}
