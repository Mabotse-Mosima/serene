"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, PieChart, Clock, BarChart2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  loadMoodHistory,
  clearMoodHistory,
  getMoodAnalytics,
  getMoodColor,
  getMoodBgColor,
  valueToMood,
  type MoodEntry,
} from "@/lib/mood-storage"
import { useToast } from "@/components/ui/use-toast"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function MoodAnalyticsPage() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load mood history from localStorage
    const history = loadMoodHistory()
    setMoodHistory(history)

    if (history.length > 0) {
      setAnalytics(getMoodAnalytics(history))
    }
  }, [])

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all mood data? This action cannot be undone.")) {
      clearMoodHistory()
      setMoodHistory([])
      setAnalytics(null)
      toast({
        title: "Mood data cleared",
        description: "All your mood tracking data has been removed.",
      })
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getMoodLabel = (value: number | null) => {
    return value !== null ? valueToMood(value) : "No data"
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value
      const moodLabel = getMoodLabel(moodValue)
      const entryCount = payload[0].payload.count

      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm">{formatDate(label)}</p>
          <p className={`text-sm font-medium ${getMoodColor(moodLabel as any)}`}>
            {moodLabel} ({moodValue?.toFixed(1)})
          </p>
          <p className="text-xs text-gray-500">{entryCount} entries</p>
        </div>
      )
    }
    return null
  }

  const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-purple-800">Mood Analytics</h1>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleClearData}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Data
          </Button>
        </div>

        {moodHistory.length === 0 ? (
          <Card className="border-purple-100 mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No mood data available yet. Start tracking your mood to see analytics.</p>
              <Button onClick={() => router.push("/")} className="mt-4 bg-purple-600 hover:bg-purple-700">
                Go to Mood Tracker
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="trends" className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center">
                <PieChart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle>Mood Trends</CardTitle>
                  <CardDescription>See how your mood has changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Last 7 Days</h3>
                      <div className="h-64">
                        {analytics?.last7Days && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.last7Days}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                              <YAxis
                                domain={[1, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tickFormatter={(value) => getMoodLabel(value).charAt(0).toUpperCase()}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Line
                                type="monotone"
                                dataKey="avgMood"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Last 30 Days</h3>
                      <div className="h-64">
                        {analytics?.last30Days && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.last30Days}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                              />
                              <YAxis
                                domain={[1, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tickFormatter={(value) => getMoodLabel(value).charAt(0).toUpperCase()}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Line
                                type="monotone"
                                dataKey="avgMood"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle>Mood Calendar</CardTitle>
                  <CardDescription>View your mood entries by date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-xs text-center font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {analytics?.last30Days &&
                      generateCalendarData(analytics.last30Days).map((day, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-md flex items-center justify-center ${
                            day.mood ? getMoodBgColor(day.mood as any) : "bg-gray-100"
                          } ${day.isCurrentMonth ? "" : "opacity-30"}`}
                        >
                          <span className={`text-xs font-medium ${day.mood ? "text-white" : "text-gray-500"}`}>
                            {new Date(day.date).getDate()}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      {["terrible", "bad", "okay", "good", "great"].map((mood) => (
                        <div key={mood} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getMoodBgColor(mood as any)} mr-1`}></div>
                          <span className="text-xs text-gray-600 capitalize">{mood}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                  <CardDescription>See the breakdown of your different moods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {analytics?.moodDistribution && (
                      <ResponsiveContainer width="100%" height="100%">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                          <div className="flex items-center justify-center">
                            <RechartsPieChart width={200} height={200}>
                              <Pie
                                data={analytics.moodDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="mood"
                                label={({ name, percent }) =>
                                  percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                                }
                              >
                                {analytics.moodDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                            </RechartsPieChart>
                          </div>
                          <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="80%">
                              <BarChart
                                data={analytics.moodDistribution}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="mood" type="category" tick={{ fontSize: 12 }} width={60} />
                                <Tooltip />
                                <Bar dataKey="count" nameKey="mood">
                                  {analytics.moodDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle>Time of Day Patterns</CardTitle>
                  <CardDescription>Discover how your mood varies throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {analytics?.timeOfDayPatterns && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.timeOfDayPatterns}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="timeSlot" />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8b5cf6"
                            domain={[1, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={(value) => getMoodLabel(value).charAt(0).toUpperCase()}
                          />
                          <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                          <Tooltip />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="avgMood"
                            name="Average Mood"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="count"
                            name="Number of Entries"
                            fill="#94a3b8"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p className="mb-2 font-medium">Insights:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {generateTimeOfDayInsights(analytics?.timeOfDayPatterns).map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

// Helper function to generate calendar data
function generateCalendarData(dailyData: any[]) {
  const today = new Date()
  const firstDay = new Date(today)
  firstDay.setDate(1) // First day of current month

  const lastMonth = new Date(today)
  lastMonth.setMonth(today.getMonth() - 1)

  // Get the first day to display (might be from previous month)
  const startDay = new Date(firstDay)
  startDay.setDate(startDay.getDate() - startDay.getDay()) // Go back to Sunday

  // Create a map of dates to mood values
  const dateMap = new Map()
  dailyData.forEach((day) => {
    if (day.avgMood !== null) {
      dateMap.set(day.date, valueToMood(day.avgMood))
    }
  })

  // Generate 42 days (6 weeks)
  const calendarDays = []
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDay)
    currentDate.setDate(startDay.getDate() + i)

    const dateStr = currentDate.toISOString().split("T")[0]
    const isCurrentMonth = currentDate.getMonth() === today.getMonth()

    calendarDays.push({
      date: dateStr,
      mood: dateMap.get(dateStr) || null,
      isCurrentMonth,
    })
  }

  return calendarDays
}

// Helper function to generate insights about time of day patterns
function generateTimeOfDayInsights(timeOfDayPatterns: any[] | undefined) {
  if (!timeOfDayPatterns || timeOfDayPatterns.length === 0) {
    return ["Not enough data to generate insights yet."]
  }

  const insights = []

  // Find time of day with best average mood
  const bestTime = [...timeOfDayPatterns].sort((a, b) => {
    if (a.avgMood === null) return 1
    if (b.avgMood === null) return -1
    return b.avgMood - a.avgMood
  })[0]

  if (bestTime.avgMood !== null) {
    insights.push(
      `Your mood tends to be best during the ${bestTime.timeSlot} (average: ${bestTime.avgMood.toFixed(1)}).`,
    )
  }

  // Find time with most entries
  const mostEntries = [...timeOfDayPatterns].sort((a, b) => b.count - a.count)[0]
  if (mostEntries.count > 0) {
    insights.push(`You log moods most frequently during the ${mostEntries.timeSlot} (${mostEntries.count} entries).`)
  }

  // Check for significant mood variations
  const validPatterns = timeOfDayPatterns.filter((p) => p.avgMood !== null)
  if (validPatterns.length > 1) {
    const moodValues = validPatterns.map((p) => p.avgMood)
    const maxDiff = Math.max(...moodValues) - Math.min(...moodValues)

    if (maxDiff >= 1.5) {
      insights.push(`Your mood varies significantly throughout the day (difference of ${maxDiff.toFixed(1)} points).`)
    } else if (maxDiff < 0.5) {
      insights.push(`Your mood is relatively stable throughout the day.`)
    }
  }

  if (insights.length === 0) {
    insights.push("Continue logging your mood to see more detailed insights.")
  }

  return insights
}
