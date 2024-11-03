export const colorUtils = {
  toBinary: (num: number): string => {
    return num.toString(2).padStart(8, "0");
  },

  bitsToDecimal: (bits: boolean[]): number => {
    return bits.reduce(
      (acc, bit, index) => acc + (bit ? Math.pow(2, 7 - index) : 0),
      0
    );
  },

  getRGBString: (red: number, green: number, blue: number): string => {
    return `rgb(${red}, ${green}, ${blue})`;
  },
};
