import React, { useRef, useEffect } from 'react';
import { CanvasSize } from './types';

interface CanvasProps {
    canvasSize: CanvasSize;
    pixelSize: number;
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    setContext: (context: CanvasRenderingContext2D) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
    canvasSize,
    pixelSize,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    setContext
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);

        // Draw initial grid
        for (let x = 0; x < canvasSize.width; x++) {
            for (let y = 0; y < canvasSize.height; y++) {
                ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
                ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }, [canvasSize, pixelSize, setContext]);

    return (
        <div className="w-full overflow-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner p-2 sm:p-4">
            <canvas
                ref={canvasRef}
                width={canvasSize.width * pixelSize}
                height={canvasSize.height * pixelSize}
                className="border border-gray-200 dark:border-gray-600 cursor-crosshair mx-auto"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
            />
        </div>
    );
};
