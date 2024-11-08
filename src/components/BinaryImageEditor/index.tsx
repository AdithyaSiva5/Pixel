"use client"
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ToolBar } from './ToolBar';
import { ColorControls } from './ColorControls';
import { SetupDialog } from './SetupDialog';
import { Canvas } from './Canvas';
import { Tool, CanvasSize } from './types';
import dynamic from 'next/dynamic';

const BinaryImageEditor = dynamic(() => Promise.resolve(BinaryImageEditorComponent), {
    ssr: false
});

const BinaryImageEditorComponent: React.FC = () => {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [tool, setTool] = useState<Tool>('pencil');
    const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
    const [setupOpen, setSetupOpen] = useState<boolean>(true);
    const [mounted, setMounted] = useState<boolean>(false);
    const [tempCanvasSize, setTempCanvasSize] = useState<CanvasSize>({ width: 32, height: 32 });
    const [pixelSize] = useState<number>(16);
    const [redBits, setRedBits] = useState<boolean[]>(() => new Array(8).fill(true));
    const [greenBits, setGreenBits] = useState<boolean[]>(() => new Array(8).fill(true));
    const [blueBits, setBlueBits] = useState<boolean[]>(() => new Array(8).fill(true));

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSetupCanvas = () => {
        const limitedSize = {
            width: Math.min(Math.max(tempCanvasSize.width, 1), 200),
            height: Math.min(Math.max(tempCanvasSize.height, 1), 200)
        };
        setCanvasSize(limitedSize);
        setSetupOpen(false);
    };

    const bitsToDecimal = (bits: boolean[]): number => {
        return bits.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, 7 - index) : 0), 0);
    };

    const getCurrentColor = (): string => {
        const red = bitsToDecimal(redBits);
        const green = bitsToDecimal(greenBits);
        const blue = bitsToDecimal(blueBits);
        return `rgb(${red}, ${green}, ${blue})`;
    };

    const generateRandomBits = (): boolean[] => {
        return new Array(8).fill(false).map(() => Math.random() > 0.5);
    };

    const setRandomColor = () => {
        setRedBits(generateRandomBits());
        setGreenBits(generateRandomBits());
        setBlueBits(generateRandomBits());
    };

    const randomizeCanvas = () => {
        if (!context || !canvasSize) return;

        for (let x = 0; x < canvasSize.width; x++) {
            for (let y = 0; y < canvasSize.height; y++) {
                const red = Math.floor(Math.random() * 256);
                const green = Math.floor(Math.random() * 256);
                const blue = Math.floor(Math.random() * 256);

                context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                context.strokeStyle = 'rgba(156, 163, 175, 0.2)';
                context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    };

    const drawPixel = (x: number, y: number): void => {
        if (!context || !canvasSize || x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) return;

        const color = tool === 'pencil' ? getCurrentColor() : 'white';
        context.fillStyle = color;
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

        context.strokeStyle = 'rgba(156, 163, 175, 0.2)';
        context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };

    const clearCanvas = (): void => {
        if (!context || !canvasSize) return;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasSize.width * pixelSize, canvasSize.height * pixelSize);

        // Redraw grid
        for (let x = 0; x < canvasSize.width; x++) {
            for (let y = 0; y < canvasSize.height; y++) {
                context.strokeStyle = 'rgba(156, 163, 175, 0.2)';
                context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    };

    const downloadImage = (): void => {
        if (!context || !canvasSize) return;

        // Create a temporary canvas with the same dimensions as the original canvas
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        if (!tempContext) return;

        tempCanvas.width = canvasSize.width * pixelSize;
        tempCanvas.height = canvasSize.height * pixelSize;

        // Copy the image data from the original canvas, excluding the grid lines
        const imageData = context.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        tempContext.putImageData(imageData, 0, 0);

        // Create download link
        const link = document.createElement('a');
        link.download = 'binary-art.png';
        link.href = tempCanvas.toDataURL('image/png', 1.0); // Use full quality (1.0)
        link.click();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        setIsDrawing(true);
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize);
        const y = Math.floor((e.clientY - rect.top) / pixelSize);
        drawPixel(x, y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        if (!isDrawing) return;
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize);
        const y = Math.floor((e.clientY - rect.top) / pixelSize);
        drawPixel(x, y);
    };

    const handleMouseUp = (): void => {
        setIsDrawing(false);
    };

    return (
        <>
            <SetupDialog
                open={setupOpen}
                onOpenChange={setSetupOpen}
                tempCanvasSize={tempCanvasSize}
                setTempCanvasSize={setTempCanvasSize}
                onSetup={handleSetupCanvas}
            />

            {canvasSize && (
                <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
                    <Card className="p-3 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            <ToolBar
                                tool={tool}
                                setTool={setTool}
                                clearCanvas={clearCanvas}
                                downloadImage={downloadImage}
                                setRandomColor={setRandomColor}
                                randomizeCanvas={randomizeCanvas}
                            />

                            <ColorControls
                                redBits={redBits}
                                greenBits={greenBits}
                                blueBits={blueBits}
                                setRedBits={setRedBits}
                                setGreenBits={setGreenBits}
                                setBlueBits={setBlueBits}
                                currentColor={getCurrentColor()}
                            />

                            <Canvas
                                canvasSize={canvasSize}
                                pixelSize={pixelSize}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                setContext={setContext}
                            />
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default BinaryImageEditor;