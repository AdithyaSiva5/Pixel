"use client"
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useEffect, useRef } from 'react'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvasState } = useCanvas()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw pixels
    canvasState.pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`
        ctx.fillRect(
          x * canvasState.zoom,
          y * canvasState.zoom,
          canvasState.zoom,
          canvasState.zoom
        )
      })
    })

    // Draw grid if enabled
    if (canvasState.showGrid) {
      ctx.strokeStyle = '#666'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= canvasState.width; i++) {
        ctx.beginPath()
        ctx.moveTo(i * canvasState.zoom, 0)
        ctx.lineTo(i * canvasState.zoom, canvasState.height * canvasState.zoom)
        ctx.stroke()
      }
      for (let i = 0; i <= canvasState.height; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * canvasState.zoom)
        ctx.lineTo(canvasState.width * canvasState.zoom, i * canvasState.zoom)
        ctx.stroke()
      }
    }
  }, [canvasState])

  return (
    <canvas
      ref={canvasRef}
      width={canvasState.width * canvasState.zoom}
      height={canvasState.height * canvasState.zoom}
      className="border border-gray-300"
    />
  )
}