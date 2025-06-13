"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, Frown, Meh, ThumbsUp, ThumbsDown, BarChart2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { type Mood, type MoodEntry, loadMoodHistory, saveMoodHistory, getMoodColor } from "@/lib/mood-storage"

export default function MoodTracker() {
  const [mood, setMood] = useState<Mood>(null)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedHistory = loadMoodHistory()
    setMoodHistory(savedHistory)
  }, [])

  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood)
  }

  const handleSubmit = () => {
    if (mood) {
      const newEntry: MoodEntry = { mood, timestamp: new Date() }
      const updatedHistory = [...moodHistory, newEntry]
      setMoodHistory(updatedHistory)
      saveMoodHistory(updatedHistory)
      setSubmitted(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setMood(null)
      }, 3000)
    }
  }

  const getMoodIcon = (moodType: Mood) => {
    switch (moodType) {
      case "great":
        return <Smile className="h-5 w-5 text-green-500" />
      case "good":
        return <ThumbsUp className="h-5 w-5 text-blue-500" />
      case "okay":
        return <Meh className="h-5 w-5 text-yellow-500" />
      case "bad":
        return <ThumbsDown className="h-5 w-5 text-orange-500" />
      case "terrible":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const navigateToAnalytics = () => {
    router.push("/mood-analytics")
  }

  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-purple-700">Mood Tracker</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={navigateToAnalytics}
          title="View Mood Analytics"
        >
          <BarChart2 className="h-4 w-4 text-purple-600" />
        </Button>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-green-500 mb-2">
              <ThumbsUp className="h-8 w-8" />
            </div>
            <p className="text-sm text-center text-gray-600">Mood logged successfully!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-3">
              <Button
                variant={mood === "terrible" ? "default" : "outline"}
                size="sm"
                className={`p-2 ${mood === "terrible" ? "bg-red-500 hover:bg-red-600" : ""}`}
                onClick={() => handleMoodSelect("terrible")}
              >
                <Frown className="h-4 w-4" />
              </Button>
              <Button
                variant={mood === "bad" ? "default" : "outline"}
                size="sm"
                className={`p-2 ${mood === "bad" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                onClick={() => handleMoodSelect("bad")}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                variant={mood === "okay" ? "default" : "outline"}
                size="sm"
                className={`p-2 ${mood === "okay" ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                onClick={() => handleMoodSelect("okay")}
              >
                <Meh className="h-4 w-4" />
              </Button>
              <Button
                variant={mood === "good" ? "default" : "outline"}
                size="sm"
                className={`p-2 ${mood === "good" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                onClick={() => handleMoodSelect("good")}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant={mood === "great" ? "default" : "outline"}
                size="sm"
                className={`p-2 ${mood === "great" ? "bg-green-500 hover:bg-green-600" : ""}`}
                onClick={() => handleMoodSelect("great")}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!mood}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              Log Mood
            </Button>
          </>
        )}

        {moodHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Recent moods:</p>
            <div className="space-y-1">
              {moodHistory
                .slice(-3)
                .reverse()
                .map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      {getMoodIcon(entry.mood)}
                      <span className={`ml-1 ${getMoodColor(entry.mood)}`}>
                        {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
