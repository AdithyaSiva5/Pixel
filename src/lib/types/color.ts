export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

export interface BinaryColorControls {
  redBits: boolean[];
  greenBits: boolean[];
  blueBits: boolean[];
  onRedChange: (bits: boolean[]) => void;
  onGreenChange: (bits: boolean[]) => void;
  onBlueChange: (bits: boolean[]) => void;
}
