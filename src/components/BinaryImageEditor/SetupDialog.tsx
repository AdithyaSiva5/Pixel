import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/Slider";
import { Button } from '@/components/ui/Button';
import { CanvasSize } from './types';

interface SetupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tempCanvasSize: CanvasSize;
    setTempCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>; 
    onSetup: () => void;
}

export const SetupDialog: React.FC<SetupDialogProps> = ({
    open,
    onOpenChange,
    tempCanvasSize,
    setTempCanvasSize,
    onSetup
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Canvas Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Width</label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{tempCanvasSize.width}px</span>
                        </div>
                        <Slider
                            min={1}
                            max={200}
                            step={1}
                            value={[tempCanvasSize.width]}
                            onValueChange={(values) => setTempCanvasSize((prev) => ({ ...prev, width: values[0] }))}

                            className="py-4"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Height</label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{tempCanvasSize.height}px</span>
                        </div>
                        <Slider
                            min={1}
                            max={200}
                            step={1}
                            value={[tempCanvasSize.height]}
                            onValueChange={(values) => setTempCanvasSize((prev) => ({ ...prev, height: values[0] }))}
                            className="py-4"
                        />
                    </div>
                </div>
                <Button onClick={onSetup} className="w-full">Create Canvas</Button>
            </div>
        </DialogContent>
    </Dialog>
);