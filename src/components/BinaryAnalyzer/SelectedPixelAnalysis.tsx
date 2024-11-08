import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SelectedPixelAnalysisProps {
    pixel: [number, number, number];
}

const SelectedPixelAnalysis: React.FC<SelectedPixelAnalysisProps> = ({ pixel }) => {
    const toBinary = (num: number): string => {
        return num.toString(2).padStart(8, '0');
    };

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Selected Pixel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <div className="font-semibold text-red-500">Red Channel</div>
                            <div className="font-mono">
                                {toBinary(pixel[0])}
                            </div>
                            <div>Value: {pixel[0]}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-semibold text-green-500">Green Channel</div>
                            <div className="font-mono">
                                {toBinary(pixel[1])}
                            </div>
                            <div>Value: {pixel[1]}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-semibold text-blue-500">Blue Channel</div>
                            <div className="font-mono">
                                {toBinary(pixel[2])}
                            </div>
                            <div>Value: {pixel[2]}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SelectedPixelAnalysis;