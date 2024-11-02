import { Canvas } from '@/components/editor/Canvas'
import { BinaryEditor } from '@/components/editor/BinaryEditor'

export default function Home() {
  return (
    <div className="flex h-screen">
      <Canvas />
      <BinaryEditor />
    </div>
  )
}