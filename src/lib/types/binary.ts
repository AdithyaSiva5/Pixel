import { Pixel } from "@/lib/types/canvas";

export const pixelToBinary = (pixel: Pixel): string => {
  const { r, g, b } = pixel;
  return [r, g, b].map((value) => value.toString(2).padStart(8, "0")).join("");
};

export const binaryToPixel = (binary: string): Pixel => {
  if (binary.length !== 24) {
    throw new Error("Invalid binary string length");
  }

  return {
    r: parseInt(binary.slice(0, 8), 2),
    g: parseInt(binary.slice(8, 16), 2),
    b: parseInt(binary.slice(16, 24), 2),
    a: 255,
  };
};

export const imageToBinary = (imageData: ImageData): string => {
  const binary: string[] = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    const pixel: Pixel = {
      r: imageData.data[i],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
      a: imageData.data[i + 3],
    };
    binary.push(pixelToBinary(pixel));
  }
  return binary.join("");
};

export const binaryToImage = (
  binary: string,
  width: number,
  height: number
): ImageData => {
  const data = new Uint8ClampedArray(width * height * 4);
  let index = 0;

  for (let i = 0; i < binary.length; i += 24) {
    const pixelBinary = binary.slice(i, i + 24);
    const pixel = binaryToPixel(pixelBinary);

    data[index] = pixel.r;
    data[index + 1] = pixel.g;
    data[index + 2] = pixel.b;
    data[index + 3] = pixel.a;

    index += 4;
  }

  return new ImageData(data, width, height);
};

// Utility for random binary generation
export const generateRandomBinary = (width: number, height: number): string => {
  let binary = "";
  for (let i = 0; i < width * height; i++) {
    binary += Array(24)
      .fill(0)
      .map(() => Math.round(Math.random()))
      .join("");
  }
  return binary;
};

// Pattern-based binary generation
export const generatePatternBinary = (
  pattern: string,
  width: number,
  height: number
): string => {
  const patternLength = pattern.length;
  let binary = "";

  for (let i = 0; i < width * height * 24; i++) {
    binary += pattern[i % patternLength];
  }

  return binary;
};
