"use client"

import React, { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from 'next-themes'

const text = `Hey there! 👋 Before clicking on and finding about my project here is a brief intro about the project and why i choose this Project

I'm Adithya and I am a Graduate, and you've just stumbled upon my fascinating "useless" project that's actually quite useful! Let me tell you why...

I've always been captivated by colors – how they're transmitted, stored, and displayed on our screens. Ever wondered how your TV shows millions of colors? Or why some video qualities load faster than others? That's exactly what this project explores!

Here's what you can do:

🔍 Visit our /analyze page to dive deep into the binary world of colors. You'll discover how every pixel in your images is stored using RGB values and hexadecimal codes. Did you know that with 8 bits per color channel, we can create over 16 million unique colors? Mind-blowing, right?

🎨 Check out the /edit page to become a binary artist! It's like Photoshop, but with a twist – you can manipulate images at their most fundamental level, adjusting their binary code directly. Save and download your creations!

Quick summary : /analyze (upload a image there and click on pixels below u could get the color codes)
/edit(where u can bring ur creativity and create images or create random images)


Through this "useless" exploration, you'll understand some very useful concepts:
- Why 144p videos load almost instantly while 4K videos take forever
- How color data is stored and processed in digital images
- The fascinating relationship between resolution, file size, and loading speed

Ready to explore? Click the links below to begin your journey into the world of digital colors!`

const formatText = (text: string) => {
  return text.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">
      {paragraph.split('\n').map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line}
          {lineIndex !== paragraph.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  ))
}

export default function Component() {
  const [displayText, setDisplayText] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { theme } = useTheme()

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30) // Adjust speed of typing here

      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-500 bg-gradient-to-br from-background via-primary/20 to-secondary/20">
      <Card className="w-full max-w-4xl mx-auto backdrop-blur-lg bg-background/60">
        <CardContent className="p-8">
          <div className="prose dark:prose-invert max-w-none">
            {formatText(displayText)}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              variant="default"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-300 ease-out hover:scale-105"
            >
              <a href="/analyze" target="_blank" rel="noopener noreferrer" className="relative z-10 flex items-center gap-2">
                Analyze Colors <ExternalLink size={18} />
                <span className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="group relative overflow-hidden bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-all duration-300 ease-out hover:scale-105"
            >
              <a href="/edit" target="_blank" rel="noopener noreferrer" className="relative z-10 flex items-center gap-2">
                Edit Images <ExternalLink size={18} />
                <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}