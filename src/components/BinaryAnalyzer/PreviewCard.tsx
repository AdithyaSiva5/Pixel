import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PreviewCardProps {
    imageData: [number, number, number][][];
    selectedPixel: { x: number, y: number } | null;
    onPixelSelect: (pixel: { x: number, y: number } | null) => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ imageData, selectedPixel, onPixelSelect }) => {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto">
                    <div className="grid gap-1 min-w-fit" style={{
                        gridTemplateColumns: `repeat(${imageData[0].length}, minmax(20px, 1fr))`
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
                                    onClick={() => onPixelSelect({ x, y })}
                                />
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PreviewCard;