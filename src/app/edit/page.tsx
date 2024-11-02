"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Download, Eraser, Pencil, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Tool = 'pencil' | 'eraser';

interface CanvasSize {
    width: number;
    height: number;
}

const BinaryImageEditor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [tool, setTool] = useState<Tool>('pencil');
    const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
    const [setupOpen, setSetupOpen] = useState<boolean>(true);
    const [tempCanvasSize, setTempCanvasSize] = useState<CanvasSize>({ width: 32, height: 32 });
    const [pixelSize, setPixelSize] = useState<number>(16);
    const [redValue, setRedValue] = useState<string>('11111111');
    const [greenValue, setGreenValue] = useState<string>('11111111');
    const [blueValue, setBlueValue] = useState<string>('11111111');

    // Initialize canvas after size is set
    useEffect(() => {
        if (!canvasSize) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
        drawGrid(ctx);
    }, [canvasSize]);

    const handleSetupCanvas = () => {
        setCanvasSize(tempCanvasSize);
        setSetupOpen(false);
    };

    const binaryToDecimal = (binary: string): number => parseInt(binary.padEnd(8, '0'), 2);

    const getCurrentColor = (): string => {
        return `rgb(${binaryToDecimal(redValue)}, ${binaryToDecimal(greenValue)}, ${binaryToDecimal(blueValue)})`;
    };

    const handleBinaryInput = (
        index: number,
        value: string,
        currentValue: string,
        setValue: (value: string) => void
    ) => {
        if (value !== '0' && value !== '1') return;

        const newValue = currentValue.split('');
        newValue[index] = value;
        setValue(newValue.join(''));
    };

    const renderBinaryInputs = (
        value: string,
        setValue: (value: string) => void,
        color: string
    ) => {
        return (
            <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Input
                        key={index}
                        value={value[index] || '0'}
                        onChange={(e) => handleBinaryInput(index, e.target.value, value, setValue)}
                        className={`w-8 h-8 p-0 text-center font-mono text-${color}-500`}
                        maxLength={1}
                    />
                ))}
            </div>
        );
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        setIsDrawing(true);
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize);
        const y = Math.floor((e.clientY - rect.top) / pixelSize);
        drawPixel(x, y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        if (!isDrawing || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize);
        const y = Math.floor((e.clientY - rect.top) / pixelSize);
        drawPixel(x, y);
    };

    const handleMouseUp = (): void => {
        setIsDrawing(false);
    };

    const drawPixel = (x: number, y: number): void => {
        if (!context || !canvasSize || x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) return;

        const color = tool === 'pencil' ? getCurrentColor() : 'white';
        context.fillStyle = color;
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

        context.strokeStyle = '#eee';
        context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };

    const clearCanvas = (): void => {
        if (!context || !canvasRef.current) return;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawGrid(context);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D): void => {
        if (!canvasSize) return;

        for (let x = 0; x < canvasSize.width; x++) {
            for (let y = 0; y < canvasSize.height; y++) {
                ctx.strokeStyle = '#eee';
                ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    };

    const downloadImage = (): void => {
        if (!canvasRef.current) return;

        const link = document.createElement('a');
        link.download = 'binary-art.png';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <>
            <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setup Canvas Size</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Width (pixels)</label>
                            <Input
                                type="number"
                                value={tempCanvasSize.width}
                                onChange={(e) => setTempCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 32 }))}
                                min={1}
                                max={64}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Height (pixels)</label>
                            <Input
                                type="number"
                                value={tempCanvasSize.height}
                                onChange={(e) => setTempCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 32 }))}
                                min={1}
                                max={64}
                            />
                        </div>
                        <Button onClick={handleSetupCanvas}>Create Canvas</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {canvasSize && (
                <div className="container mx-auto p-4 space-y-6">
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <h1 className="text-2xl font-bold">Binary Image Editor</h1>
                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        variant={tool === 'pencil' ? 'default' : 'outline'}
                                        onClick={() => setTool('pencil')}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Draw
                                    </Button>

                                    <Button
                                        variant={tool === 'eraser' ? 'default' : 'outline'}
                                        onClick={() => setTool('eraser')}
                                    >
                                        <Eraser className="h-4 w-4 mr-2" />
                                        Erase
                                    </Button>

                                    <Button variant="outline" onClick={clearCanvas}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>

                                    <Button variant="outline" onClick={downloadImage}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>

                            <Card className="p-4">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Binary Color Values</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-red-500 font-medium">Red Channel</label>
                                            {renderBinaryInputs(redValue, setRedValue, 'red')}
                                            <div className="text-sm">Dec: {binaryToDecimal(redValue)}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-green-500 font-medium">Green Channel</label>
                                            {renderBinaryInputs(greenValue, setGreenValue, 'green')}
                                            <div className="text-sm">Dec: {binaryToDecimal(greenValue)}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-blue-500 font-medium">Blue Channel</label>
                                            {renderBinaryInputs(blueValue, setBlueValue, 'blue')}
                                            <div className="text-sm">Dec: {binaryToDecimal(blueValue)}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Color Preview</label>
                                            <div
                                                className="w-full h-16 rounded border"
                                                style={{ backgroundColor: getCurrentColor() }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="w-full overflow-auto">
                                <canvas
                                    ref={canvasRef}
                                    width={canvasSize.width * pixelSize}
                                    height={canvasSize.height * pixelSize}
                                    className="border border-gray-200 cursor-crosshair"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default BinaryImageEditor;