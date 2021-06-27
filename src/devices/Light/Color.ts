import colorConvert from 'color';
type ColorConvert = InstanceType<typeof colorConvert>;

export class Color {
  private hsv: [h: number, s: number, v: number];

  constructor(color: ColorConvert) {
    this.hsv = color.hsv().array() as Color['hsv'];
  }

  public toTuyaColor(): string {
    const [ h, s, v ] = this.hsv;
    const buf = Buffer.alloc(6);
    buf.writeInt16BE(h, 0);
    buf.writeInt16BE(s * 10, 2);
    buf.writeInt16BE(v * 10, 4);
    return buf.toString('hex');
  }

  public toColor(): ColorConvert {
    return colorConvert.hsv(this.hsv);
  }

  static fromRGB(input: `#${string}` | [r: number, g: number, b: number] | number) {
    if (typeof input === 'number') {
      input = `#${input.toString(16).padStart(6, '0')}`;
    }

    return new Color(colorConvert.rgb(input));
  }

  public static fromTuyaColor(input: string): Color {
    const data = Buffer.from(input, 'hex');
    const h = data.readInt16BE(0);
    const s = data.readInt16BE(2) / 10;
    const v = data.readInt16BE(4) / 10;
    return new Color(colorConvert.hsv(h, s, v));
  }
}
