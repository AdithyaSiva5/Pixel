// components/editor/BinaryEditor.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface Pixel {
  value: number
  color: string
}

interface BinaryEditorProps {
  width?: number
  height?: number
  pixelSize?: number
}

export function BinaryEditor({
  width = 16,
  height = 16,
  pixelSize = 20
}: BinaryEditorProps) {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [currentPixel, setCurrentPixel] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const initialPixels = Array(width * height).fill(null).map(() => ({
      value: 0,
      color: '#ffffff'
    }))
    setPixels(initialPixels)
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width * pixelSize
    canvas.height = height * pixelSize

    // Draw pixels
    pixels.forEach((pixel, index) => {
      const x = (index % width) * pixelSize
      const y = Math.floor(index / width) * pixelSize

      ctx.fillStyle = pixel.color
      ctx.fillRect(x, y, pixelSize, pixelSize)

      // Draw grid
      ctx.strokeStyle = '#e5e7eb'
      ctx.strokeRect(x, y, pixelSize, pixelSize)

      // Highlight current pixel
      if (index === currentPixel) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, pixelSize, pixelSize)
        ctx.lineWidth = 1
      }
    })
  }, [pixels, currentPixel, width, height, pixelSize])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const pixelX = Math.floor(x / pixelSize)
    const pixelY = Math.floor(y / pixelSize)
    const index = pixelY * width + pixelX

    if (index >= 0 && index < pixels.length) {
      const newPixels = [...pixels]
      newPixels[index] = {
        value: 1 - newPixels[index].value,
        color: newPixels[index].value ? '#ffffff' : '#000000'
      }
      setPixels(newPixels)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2]">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border border-border shadow-sm"
      />
    </div>
  )
}