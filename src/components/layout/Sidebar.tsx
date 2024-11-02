// components/layout/Sidebar.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/Slider'
import { Button } from '@/components/ui/Button'
import { Shuffle } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <Tabs defaultValue="input" className="flex-1">
          <div className="p-4 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="input" className="flex-1">Input</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="input" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Binary Input</Label>
              <Input placeholder="Type 0s and 1s..." />
            </div>

            <div className="space-y-2">
              <Label>Current Position: 0/256</Label>
              <div className="flex gap-2">
                <Button className="flex-1">Reset</Button>
                <Button variant="outline" size="icon">
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Canvas Width</Label>
              <Slider defaultValue={[16]} max={64} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Canvas Height</Label>
              <Slider defaultValue={[16]} max={64} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Pixel Size</Label>
              <Slider defaultValue={[20]} max={50} step={1} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}