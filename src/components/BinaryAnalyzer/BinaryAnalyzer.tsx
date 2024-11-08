"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Eye, Binary } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import PreviewCard from './PreviewCard';
import BinaryDataCard from './BinaryDataCard';
import SelectedPixelAnalysis from './SelectedPixelAnalysis';

export default function BinaryAnalyzer() {
    const [imageData, setImageData] = useState<[number, number, number][][]>([]);
    const [selectedPixel, setSelectedPixel] = useState<{ x: number, y: number } | null>(null);
    const [showPreview, setShowPreview] = useState(true);
    const [showBinary, setShowBinary] = useState(true);

    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Convert image data to 3D RGB array
                const pixels = convertImageToPixelData(img);
                setImageData(pixels);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    return (
        <div className="container mx-auto p-4 space-y-6 max-w-7xl">
            <Card className="p-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Binary Image Analyzer</h1>

                    <div className="flex flex-wrap gap-4">
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

                        <Button
                            variant="outline"
                            onClick={() => setShowBinary(!showBinary)}
                        >
                            <Binary className="h-4 w-4 mr-2" />
                            {showBinary ? 'Hide' : 'Show'} Binary
                        </Button>
                    </div>
                </div>
            </Card>

            {imageData.length > 0 && (
                <div className={`grid gap-6 ${showPreview && showBinary ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {showPreview && (
                        <PreviewCard
                            imageData={imageData}
                            selectedPixel={selectedPixel}
                            onPixelSelect={setSelectedPixel}
                        />
                    )}

                    {showBinary && (
                        <BinaryDataCard
                            imageData={imageData}
                            selectedPixel={selectedPixel}
                        />
                    )}
                </div>
            )}

            {selectedPixel && imageData[selectedPixel.y]?.[selectedPixel.x] && (
                <SelectedPixelAnalysis
                    pixel={imageData[selectedPixel.y][selectedPixel.x]}
                />
            )}
        </div>
    );


    function convertImageToPixelData(img: HTMLImageElement): [number, number, number][][] {
        const canvas = document.createElement('canvas');
        const maxSize = 32; // Limit size for performance
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return [];

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageDataRaw = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert to RGB array
        const pixels: [number, number, number][][] = [];
        for (let y = 0; y < canvas.height; y++) {
            const row: [number, number, number][] = [];
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
        return pixels;
    }
}