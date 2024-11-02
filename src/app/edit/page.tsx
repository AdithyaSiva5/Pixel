"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Download, Eraser, Pencil, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/Slider";

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
    const [redBits, setRedBits] = useState<boolean[]>(new Array(8).fill(true));
    const [greenBits, setGreenBits] = useState<boolean[]>(new Array(8).fill(true));
    const [blueBits, setBlueBits] = useState<boolean[]>(new Array(8).fill(true));

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

    const renderBitButtons = (
        bits: boolean[],
        setBits: (newBits: boolean[]) => void,
        color: string
    ) => {
        return (
            <div className="grid grid-cols-8 gap-1">
                {bits.map((bit, index) => (
                    <Button
                        key={index}
                        variant={bit ? "default" : "outline"}
                        size="sm"
                        className={`w-10 h-10 p-0 font-mono ${bit
                                ? `bg-${color}-500 hover:bg-${color}-600`
                                : `hover:bg-${color}-100`
                            }`}
                        onClick={() => {
                            const newBits = [...bits];
                            newBits[index] = !bit;
                            setBits(newBits);
                        }}
                    >
                        {bit ? "1" : "0"}
                    </Button>
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
                        <DialogTitle>Canvas Configuration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium">Width</label>
                                    <span className="text-sm text-gray-500">{tempCanvasSize.width}px</span>
                                </div>
                                <Slider
                                    min={1}
                                    max={200}
                                    step={1}
                                    value={[tempCanvasSize.width]}
                                    onValueChange={([value]) => setTempCanvasSize(prev => ({ ...prev, width: value }))}
                                    className="py-4"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium">Height</label>
                                    <span className="text-sm text-gray-500">{tempCanvasSize.height}px</span>
                                </div>
                                <Slider
                                    min={1}
                                    max={200}
                                    step={1}
                                    value={[tempCanvasSize.height]}
                                    onValueChange={([value]) => setTempCanvasSize(prev => ({ ...prev, height: value }))}
                                    className="py-4"
                                />
                            </div>
                        </div>
                        <Button onClick={handleSetupCanvas} className="w-full">Create Canvas</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {canvasSize && (
                <div className="container mx-auto p-4 space-y-6">
                    <Card className="p-6">
                        <div className="space-y-6">
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

                            <Card className="p-6 bg-gray-50">
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold">Binary Color Control</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-medium text-red-500">Red Channel</label>
                                                    <span className="text-sm text-gray-500">Dec: {bitsToDecimal(redBits)}</span>
                                                </div>
                                                {renderBitButtons(redBits, setRedBits, 'red')}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-medium text-green-500">Green Channel</label>
                                                    <span className="text-sm text-gray-500">Dec: {bitsToDecimal(greenBits)}</span>
                                                </div>
                                                {renderBitButtons(greenBits, setGreenBits, 'green')}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-medium text-blue-500">Blue Channel</label>
                                                    <span className="text-sm text-gray-500">Dec: {bitsToDecimal(blueBits)}</span>
                                                </div>
                                                {renderBitButtons(blueBits, setBlueBits, 'blue')}
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            <label className="text-sm font-medium">Color Preview</label>
                                            <div className="flex-1 rounded-lg shadow-inner" style={{
                                                backgroundColor: getCurrentColor(),
                                                border: '1px solid rgba(0,0,0,0.1)'
                                            }} />
                                            <div className="text-sm text-gray-500 font-mono">
                                                RGB({bitsToDecimal(redBits)}, {bitsToDecimal(greenBits)}, {bitsToDecimal(blueBits)})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="w-full overflow-auto bg-white rounded-lg shadow-inner p-4">
                                <canvas
                                    ref={canvasRef}
                                    width={canvasSize.width * pixelSize}
                                    height={canvasSize.height * pixelSize}
                                    className="border border-gray-200 cursor-crosshair mx-auto"
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