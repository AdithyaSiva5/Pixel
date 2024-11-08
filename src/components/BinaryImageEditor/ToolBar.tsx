import React from 'react';
import { Download, Eraser, Pencil, RotateCcw, Dices, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tool } from './types';

interface ToolBarProps {
    tool: Tool;
    setTool: (tool: Tool) => void;
    clearCanvas: () => void;
    downloadImage: () => void;
    setRandomColor: () => void;
    randomizeCanvas: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
    tool,
    setTool,
    clearCanvas,
    downloadImage,
    setRandomColor,
    randomizeCanvas
}) => (
    <div className="flex flex-wrap gap-2">
        <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            onClick={() => setTool('pencil')}
            className="flex-grow sm:flex-grow-0"
        >
            <Pencil className="h-4 w-4 mr-2" />
            Draw
        </Button>

        <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            onClick={() => setTool('eraser')}
            className="flex-grow sm:flex-grow-0"
        >
            <Eraser className="h-4 w-4 mr-2" />
            Erase
        </Button>

        <Button
            variant="outline"
            onClick={clearCanvas}
            className="flex-grow sm:flex-grow-0"
        >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
        </Button>

        <Button
            variant="outline"
            onClick={downloadImage}
            className="flex-grow sm:flex-grow-0"
        >
            <Download className="h-4 w-4 mr-2" />
            Download
        </Button>

        <Button
            variant="outline"
            onClick={setRandomColor}
            className="flex-grow sm:flex-grow-0"
        >
            <Palette className="h-4 w-4 mr-2" />
            Random Color
        </Button>

        <Button
            variant="outline"
            onClick={randomizeCanvas}
            className="flex-grow sm:flex-grow-0"
        >
            <Dices className="h-4 w-4 mr-2" />
            Randomize
        </Button>
    </div>
);
