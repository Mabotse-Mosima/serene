"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

const strategies = [
  {
    title: "5-4-3-2-1 Grounding",
    description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
  },
  {
    title: "Box Breathing",
    description: "Breathe in for 4 counts, hold for 4, exhale for 4, and hold for 4. Repeat several times.",
  },
  {
    title: "Body Scan",
    description:
      "Starting from your toes, slowly bring attention to each part of your body, noticing sensations without judgment.",
  },
  {
    title: "Positive Affirmations",
    description: "Repeat positive statements like 'I am capable', 'I am enough', or 'This feeling will pass'.",
  },
  {
    title: "Progressive Relaxation",
    description: "Tense and then release each muscle group in your body, starting from your feet and moving upward.",
  },
]

export default function CopingStrategies() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextStrategy = () => {
    setCurrentIndex((prev) => (prev + 1) % strategies.length)
  }

  const prevStrategy = () => {
    setCurrentIndex((prev) => (prev - 1 + strategies.length) % strategies.length)
  }

  const currentStrategy = strategies[currentIndex]

  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-purple-700">Coping Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="min-h-[120px] flex flex-col justify-between">
            <h3 className="font-medium text-sm text-purple-800 mb-2">{currentStrategy.title}</h3>
            <p className="text-xs text-gray-600">{currentStrategy.description}</p>
          </div>

          <div className="flex justify-between mt-3">
            <Button variant="ghost" size="sm" onClick={prevStrategy} className="p-0 h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-1">
              {strategies.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? "bg-purple-500" : "bg-gray-200"}`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={nextStrategy} className="p-0 h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
