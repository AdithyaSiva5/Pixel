import { useState, useCallback } from "react";
import { CanvasState, Pixel } from "@/lib/types/canvas";

export const useCanvas = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 32,
    height: 32,
    pixels: Array(32).fill(Array(32).fill({ r: 0, g: 0, b: 0, a: 255 })),
    selectedPixels: [],
    zoom: 1,
    showGrid: true,
  });

  const updatePixel = useCallback((x: number, y: number, pixel: Pixel) => {
    setCanvasState((prev) => {
      const newPixels = [...prev.pixels];
      newPixels[y] = [...newPixels[y]];
      newPixels[y][x] = pixel;
      return { ...prev, pixels: newPixels };
    });
  }, []);

  const toBinary = useCallback((pixel: Pixel): string => {
    return [pixel.r, pixel.g, pixel.b]
      .map((value) => value.toString(2).padStart(8, "0"))
      .join("");
  }, []);

  const fromBinary = useCallback((binary: string): Pixel => {
    const r = parseInt(binary.slice(0, 8), 2);
    const g = parseInt(binary.slice(8, 16), 2);
    const b = parseInt(binary.slice(16, 24), 2);
    return { r, g, b, a: 255 };
  }, []);

  return {
    canvasState,
    setCanvasState,
    updatePixel,
    toBinary,
    fromBinary,
  };
};
