"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")
  const [timer, setTimer] = useState(0)

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1,
  }

  const phaseMessages = {
    inhale: "Breathe in...",
    hold: "Hold...",
    exhale: "Breathe out...",
    rest: "Reset...",
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1

          // Check if we need to change phase
          const currentPhaseDuration = phaseDurations[phase]
          if (newTimer >= currentPhaseDuration) {
            // Move to next phase
            switch (phase) {
              case "inhale":
                setPhase("hold")
                break
              case "hold":
                setPhase("exhale")
                break
              case "exhale":
                setPhase("rest")
                break
              case "rest":
                setPhase("inhale")
                break
            }
            return 0 // Reset timer for new phase
          }

          return newTimer
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, phase])

  const toggleExercise = () => {
    if (!isActive) {
      // Starting fresh
      setPhase("inhale")
      setTimer(0)
    }
    setIsActive(!isActive)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
  }

  const getProgressPercentage = () => {
    const currentPhaseDuration = phaseDurations[phase]
    return (timer / currentPhaseDuration) * 100
  }

  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-purple-700">4-7-8 Breathing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="289.27"
                strokeDashoffset={289.27 - (289.27 * getProgressPercentage()) / 100}
                className={`transform -rotate-90 origin-center transition-all duration-300 ${
                  phase === "inhale"
                    ? "text-blue-400"
                    : phase === "hold"
                      ? "text-purple-400"
                      : phase === "exhale"
                        ? "text-green-400"
                        : "text-gray-300"
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-gray-700">{isActive ? phaseMessages[phase] : "Ready"}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-purple-200 text-purple-700" onClick={toggleExercise}>
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-purple-200 text-purple-700"
              onClick={resetExercise}
              disabled={!isActive && timer === 0}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-3 text-xs text-gray-500 text-center">Breathe in for 4, hold for 7, exhale for 8</p>
        </div>
      </CardContent>
    </Card>
  )
}
