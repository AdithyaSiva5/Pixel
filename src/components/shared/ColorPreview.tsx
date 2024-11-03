import { RGBColor } from '@/lib/types/color';

export const ColorPreview: React.FC<{ color: RGBColor }> = ({ color }) => {
    return (
        <div className="space-y-2">
            <div
                className="w-full h-32 rounded-lg shadow-inner"
                style={{
                    backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                    border: '1px solid rgba(0,0,0,0.1)'
                }}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                RGB({color.red}, {color.green}, {color.blue})
            </div>
        </div>
    );
};
