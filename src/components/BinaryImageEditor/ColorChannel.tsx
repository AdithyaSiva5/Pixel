import React from 'react';
import { Button } from '@/components/ui/Button';
import { ColorChannelProps } from './types';

export const ColorChannel: React.FC<ColorChannelProps> = ({
    bits,
    setBits,
    label,
    colorType,
    decimalValue
}) => {
    const getColorClasses = (isActive: boolean, colorType: string) => {
        if (isActive) {
            switch (colorType) {
                case 'red': return 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700';
                case 'green': return 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700';
                case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700';
                default: return '';
            }
        }
        return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700';
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className={`text-sm font-medium text-${colorType}-500`}>{label}</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">Dec: {decimalValue}</span>
            </div>
            <div className="grid grid-cols-8 gap-0.5">
                {bits.map((bit, index) => (
                    <Button
                        key={index}
                        variant={bit ? "default" : "outline"}
                        size="sm"
                        className={`w-7 h-7 sm:w-9 sm:h-9 p-0 font-mono ${getColorClasses(bit, colorType)}`}
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
        </div>
    );
};
