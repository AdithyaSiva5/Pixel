import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BinaryDataCardProps {
    imageData: [number, number, number][][];
    selectedPixel: { x: number, y: number } | null;
}


const BinaryDataCard: React.FC<BinaryDataCardProps> = ({ imageData, selectedPixel }) => {
    const binaryDataRef = useRef<HTMLDivElement>(null);

    // Scroll to selected pixel in binary view
    useEffect(() => {
        if (selectedPixel && binaryDataRef.current) {
            const pixelElement = document.getElementById(`binary-${selectedPixel.x}-${selectedPixel.y}`);
            if (pixelElement) {
                pixelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedPixel]);

    const toBinary = (num: number): string => {
        return num.toString(2).padStart(8, '0');
    };

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Binary Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto max-h-96" ref={binaryDataRef}>
                    <div className="space-y-2 font-mono text-sm min-w-fit">
                        {imageData.map((row, y) =>
                            row.map((pixel, x) => (
                                <div
                                    id={`binary-${x}-${y}`}
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
                </div>
            </CardContent>
        </Card>
    );
};

export default BinaryDataCard;