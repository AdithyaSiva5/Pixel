import React from 'react';
import { Card } from '@/components/ui/card';
import { ColorChannel } from './ColorChannel';

interface ColorControlsProps {
    redBits: boolean[];
    greenBits: boolean[];
    blueBits: boolean[];
    setRedBits: (bits: boolean[]) => void;
    setGreenBits: (bits: boolean[]) => void;
    setBlueBits: (bits: boolean[]) => void;
    currentColor: string;
}

export const ColorControls: React.FC<ColorControlsProps> = ({
    redBits,
    greenBits,
    blueBits,
    setRedBits,
    setGreenBits,
    setBlueBits,
    currentColor
}) => {
    const bitsToDecimal = (bits: boolean[]): number => {
        return bits.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, 7 - index) : 0), 0);
    };

    return (
        <Card className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg font-semibold">Binary Color Control</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                        <ColorChannel
                            bits={redBits}
                            setBits={setRedBits}
                            label="Red Channel"
                            colorType="red"
                            decimalValue={bitsToDecimal(redBits)}
                        />
                        <ColorChannel
                            bits={greenBits}
                            setBits={setGreenBits}
                            label="Green Channel"
                            colorType="green"
                            decimalValue={bitsToDecimal(greenBits)}
                        />
                        <ColorChannel
                            bits={blueBits}
                            setBits={setBlueBits}
                            label="Blue Channel"
                            colorType="blue"
                            decimalValue={bitsToDecimal(blueBits)}
                        />
                    </div>

                    <div className="flex flex-col space-y-4 min-h-[200px]">
                        <label className="text-sm font-medium">Color Preview</label>
                        <div
                            className="flex-1 rounded-lg shadow-inner"
                            style={{
                                backgroundColor: currentColor,
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                        />
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            RGB({bitsToDecimal(redBits)}, {bitsToDecimal(greenBits)}, {bitsToDecimal(blueBits)})
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};