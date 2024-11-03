import { Button } from '@/components/ui/Button';

interface BinaryBitButtonsProps {
    bits: boolean[];
    onChange: (bits: boolean[]) => void;
    color: 'red' | 'green' | 'blue';
    value: number;
}

export const BinaryBitButtons: React.FC<BinaryBitButtonsProps> = ({
    bits,
    onChange,
    color,
    value
}) => {
    const getColorClasses = (isActive: boolean, colorType: string) => {
        if (isActive) {
            switch (colorType) {
                case 'red': return 'bg-red-500 hover:bg-red-600 text-white';
                case 'green': return 'bg-green-500 hover:bg-green-600 text-white';
                case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-white';
                default: return '';
            }
        }
        return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700';
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className={`text-sm font-medium text-${color}-500`}>
                    {color.charAt(0).toUpperCase() + color.slice(1)} Channel
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Dec: {value}
                </span>
            </div>
            <div className="grid grid-cols-8 gap-0.5">
                {bits.map((bit, index) => (
                    <Button
                        key={index}
                        variant={bit ? "default" : "outline"}
                        size="sm"
                        className={`w-7 h-7 p-0 font-mono ${getColorClasses(bit, color)}`}
                        onClick={() => {
                            const newBits = [...bits];
                            newBits[index] = !bit;
                            onChange(newBits);
                        }}
                    >
                        {bit ? "1" : "0"}
                    </Button>
                ))}
            </div>
        </div>
    );
};