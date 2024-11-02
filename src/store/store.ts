// src/store/store.ts
import { create } from "zustand";
import { CanvasState, Tool, Pixel } from "@/lib/types/canvas";

interface State {
  canvas: CanvasState;
  currentTool: Tool;
  selectedColor: Pixel;
  history: CanvasState[];
  historyIndex: number;
  setCanvas: (canvas: CanvasState) => void;
  setTool: (tool: Tool) => void;
  setColor: (color: Pixel) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: (state: CanvasState) => void;
}

export const useStore = create<State>((set) => ({
  canvas: {
    width: 32,
    height: 32,
    pixels: Array(32).fill(Array(32).fill({ r: 0, g: 0, b: 0, a: 255 })),
    selectedPixels: [],
    zoom: 1,
    showGrid: true,
  },
  currentTool: "draw",
  selectedColor: { r: 0, g: 0, b: 0, a: 255 },
  history: [],
  historyIndex: -1,
  setCanvas: (canvas) => set({ canvas }),
  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ selectedColor: color }),
  pushHistory: (state) =>
    set((prev) => ({
      history: [...prev.history.slice(0, prev.historyIndex + 1), state],
      historyIndex: prev.historyIndex + 1,
    })),
  undo: () =>
    set((state) => {
      if (state.historyIndex > 0) {
        return {
          canvas: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }),
  redo: () =>
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        return {
          canvas: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }),
}));
