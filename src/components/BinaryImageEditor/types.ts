export type Tool = 'pencil' | 'eraser';

export interface CanvasSize {
    width: number;
    height: number;
}

export interface ColorChannelProps {
    bits: boolean[];
    setBits: (newBits: boolean[]) => void;
    label: string;
    colorType: 'red' | 'green' | 'blue';
    decimalValue: number;
}