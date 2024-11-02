"use client";
import React, { useState, useCallback } from 'react';
import { Upload, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

export default function BinaryAnalyzer() {
    const [imageData, setImageData] = useState<number[][][]>([]);
    const [selectedPixel, setSelectedPixel] = useState<{ x: number, y: number } | null>(null);
    const [showPreview, setShowPreview] = useState(true);

    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxSize = 32; // Limit size for performance
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageDataRaw = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Convert to RGB array
                const pixels: number[][][] = [];
                for (let y = 0; y < canvas.height; y++) {
                    const row: number[][] = [];
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        row.push([
                            imageDataRaw.data[i],     // R
                            imageDataRaw.data[i + 1], // G
                            imageDataRaw.data[i + 2]  // B
                        ]);
                    }
                    pixels.push(row);
                }
                setImageData(pixels);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    const toBinary = (num: number): string => {
        return num.toString(2).padStart(8, '0');
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Binary Image Analyzer</h1>

                    <div className="flex gap-4">
                        <Button variant="outline" className="w-40">
                            <label className="cursor-pointer flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Image
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            {showPreview ? 'Hide' : 'Show'} Preview
                        </Button>
                    </div>
                </div>
            </Card>

            {imageData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {showPreview && (
                        <Card className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Preview</h2>
                            <div className="grid gap-1" style={{
                                gridTemplateColumns: `repeat(${imageData[0].length}, minmax(0, 1fr))`
                            }}>
                                {imageData.map((row, y) =>
                                    row.map((pixel, x) => (
                                        <div
                                            key={`${x}-${y}`}
                                            className={`aspect-square border cursor-pointer transition-all ${selectedPixel?.x === x && selectedPixel?.y === y
                                                ? 'ring-2 ring-blue-500'
                                                : 'hover:ring-2 hover:ring-blue-300'
                                                }`}
                                            style={{
                                                backgroundColor: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
                                            }}
                                            onClick={() => setSelectedPixel({ x, y })}
                                        />
                                    ))
                                )}
                            </div>
                        </Card>
                    )}

                    <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Binary Data</h2>
                        <div className="space-y-2 font-mono text-sm">
                            {imageData.map((row, y) =>
                                row.map((pixel, x) => (
                                    <div
                                        key={`${x}-${y}`}
                                        className={`p-2 rounded ${selectedPixel?.x === x && selectedPixel?.y === y
                                            ? 'bg-blue-100 dark:bg-blue-900'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <span className="text-gray-500 w-16">
                                                [{x}, {y}]:
                                            </span>
                                            <span className="text-red-500">{toBinary(pixel[0])}</span>
                                            <span className="text-green-500">{toBinary(pixel[1])}</span>
                                            <span className="text-blue-500">{toBinary(pixel[2])}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {selectedPixel && imageData[selectedPixel.y]?.[selectedPixel.x] && (
                <Card className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Selected Pixel Analysis</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <div className="font-semibold text-red-500">Red Channel</div>
                                <div className="font-mono">
                                    {toBinary(imageData[selectedPixel.y][selectedPixel.x][0])}
                                </div>
                                <div>Value: {imageData[selectedPixel.y][selectedPixel.x][0]}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-green-500">Green Channel</div>
                                <div className="font-mono">
                                    {toBinary(imageData[selectedPixel.y][selectedPixel.x][1])}
                                </div>
                                <div>Value: {imageData[selectedPixel.y][selectedPixel.x][1]}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-blue-500">Blue Channel</div>
                                <div className="font-mono">
                                    {toBinary(imageData[selectedPixel.y][selectedPixel.x][2])}
                                </div>
                                <div>Value: {imageData[selectedPixel.y][selectedPixel.x][2]}</div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}