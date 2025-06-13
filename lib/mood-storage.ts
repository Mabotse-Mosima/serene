export type Mood = "great" | "good" | "okay" | "bad" | "terrible" | null
export type MoodEntry = { mood: Mood; timestamp: Date; note?: string }

// Convert to a format that can be stored in localStorage
export function serializeMoodHistory(moodHistory: MoodEntry[]): string {
  return JSON.stringify(
    moodHistory.map((entry) => ({
      mood: entry.mood,
      timestamp: entry.timestamp.toISOString(),
      note: entry.note,
    })),
  )
}

// Convert from localStorage format back to MoodEntry[]
export function deserializeMoodHistory(serialized: string): MoodEntry[] {
  try {
    const parsed = JSON.parse(serialized)
    return parsed.map((entry) => ({
      mood: entry.mood,
      timestamp: new Date(entry.timestamp),
      note: entry.note,
    }))
  } catch (e) {
    console.error("Failed to parse mood history:", e)
    return []
  }
}

// Save mood history to localStorage
export function saveMoodHistory(moodHistory: MoodEntry[]): void {
  try {
    localStorage.setItem("mood-history", serializeMoodHistory(moodHistory))
  } catch (e) {
    console.error("Failed to save mood history:", e)
  }
}

// Load mood history from localStorage
export function loadMoodHistory(): MoodEntry[] {
  try {
    const saved = localStorage.getItem("mood-history")
    if (saved) {
      return deserializeMoodHistory(saved)
    }
  } catch (e) {
    console.error("Failed to load mood history:", e)
  }
  return []
}

// Clear mood history from localStorage
export function clearMoodHistory(): void {
  try {
    localStorage.removeItem("mood-history")
  } catch (e) {
    console.error("Failed to clear mood history:", e)
  }
}

// Get mood data for analytics
export function getMoodAnalytics(moodHistory: MoodEntry[]) {
  // Last 7 days data
  const last7Days = getLastNDaysData(moodHistory, 7)

  // Last 30 days data
  const last30Days = getLastNDaysData(moodHistory, 30)

  // Mood distribution
  const moodDistribution = getMoodDistribution(moodHistory)

  // Time of day patterns
  const timeOfDayPatterns = getTimeOfDayPatterns(moodHistory)

  return {
    last7Days,
    last30Days,
    moodDistribution,
    timeOfDayPatterns,
  }
}

// Helper function to get data for the last N days
function getLastNDaysData(moodHistory: MoodEntry[], days: number) {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - days)

  // Filter entries from the last N days
  const recentEntries = moodHistory.filter((entry) => entry.timestamp >= startDate)

  // Create a map of dates to mood values (numeric)
  const dateMap = new Map<string, number[]>()

  recentEntries.forEach((entry) => {
    const dateStr = entry.timestamp.toISOString().split("T")[0]
    const moodValue = moodToValue(entry.mood)

    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, [])
    }
    dateMap.get(dateStr)?.push(moodValue)
  })

  // Generate all dates in the range
  const result = []
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const moodValues = dateMap.get(dateStr) || []
    const avgMood = moodValues.length > 0 ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length : null

    result.unshift({
      date: dateStr,
      avgMood,
      count: moodValues.length,
    })
  }

  return result
}

// Helper function to get mood distribution
function getMoodDistribution(moodHistory: MoodEntry[]) {
  const distribution = {
    great: 0,
    good: 0,
    okay: 0,
    bad: 0,
    terrible: 0,
  }

  moodHistory.forEach((entry) => {
    if (entry.mood && entry.mood in distribution) {
      distribution[entry.mood]++
    }
  })

  return Object.entries(distribution).map(([mood, count]) => ({
    mood,
    count,
  }))
}

// Helper function to get time of day patterns
function getTimeOfDayPatterns(moodHistory: MoodEntry[]) {
  const timeSlots = {
    morning: { count: 0, sum: 0 }, // 5am - 11:59am
    afternoon: { count: 0, sum: 0 }, // 12pm - 4:59pm
    evening: { count: 0, sum: 0 }, // 5pm - 8:59pm
    night: { count: 0, sum: 0 }, // 9pm - 4:59am
  }

  moodHistory.forEach((entry) => {
    const hour = entry.timestamp.getHours()
    const moodValue = moodToValue(entry.mood)

    if (moodValue === null) return

    let timeSlot: keyof typeof timeSlots

    if (hour >= 5 && hour < 12) {
      timeSlot = "morning"
    } else if (hour >= 12 && hour < 17) {
      timeSlot = "afternoon"
    } else if (hour >= 17 && hour < 21) {
      timeSlot = "evening"
    } else {
      timeSlot = "night"
    }

    timeSlots[timeSlot].count++
    timeSlots[timeSlot].sum += moodValue
  })

  return Object.entries(timeSlots).map(([timeSlot, data]) => ({
    timeSlot,
    avgMood: data.count > 0 ? data.sum / data.count : null,
    count: data.count,
  }))
}

// Convert mood to numeric value for calculations
export function moodToValue(mood: Mood): number | null {
  switch (mood) {
    case "great":
      return 5
    case "good":
      return 4
    case "okay":
      return 3
    case "bad":
      return 2
    case "terrible":
      return 1
    default:
      return null
  }
}

// Convert numeric value back to mood
export function valueToMood(value: number | null): Mood {
  if (value === null) return null
  if (value >= 4.5) return "great"
  if (value >= 3.5) return "good"
  if (value >= 2.5) return "okay"
  if (value >= 1.5) return "bad"
  return "terrible"
}

// Get color for mood
export function getMoodColor(mood: Mood): string {
  switch (mood) {
    case "great":
      return "text-green-500"
    case "good":
      return "text-blue-500"
    case "okay":
      return "text-yellow-500"
    case "bad":
      return "text-orange-500"
    case "terrible":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

// Get background color for mood
export function getMoodBgColor(mood: Mood): string {
  switch (mood) {
    case "great":
      return "bg-green-500"
    case "good":
      return "bg-blue-500"
    case "okay":
      return "bg-yellow-500"
    case "bad":
      return "bg-orange-500"
    case "terrible":
      return "bg-red-500"
    default:
      return "bg-gray-300"
  }
}
