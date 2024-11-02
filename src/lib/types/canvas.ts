export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface CanvasState {
  width: number;
  height: number;
  pixels: Pixel[][];
  selectedPixels: { x: number; y: number }[];
  zoom: number;
  showGrid: boolean;
}

export type Tool = "select" | "draw" | "erase" | "randomize" | "pattern";
