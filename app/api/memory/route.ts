import { conversationMemory } from "@/lib/conversation-memory"

export async function GET() {
  try {
    // Return basic memory stats (without exposing all details)
    const userName = conversationMemory.getUserName()
    const recentEmotions = conversationMemory.getRecentEmotions()
    const sessionDuration = conversationMemory.getSessionDuration()
    const isReturningUser = conversationMemory.isReturningUser()
    const preferredStrategies = conversationMemory.getPreferredCopingStrategies()

    return new Response(
      JSON.stringify({
        success: true,
        memoryStats: {
          hasUserName: !!userName,
          emotionCount: recentEmotions.length,
          sessionDurationMinutes: sessionDuration,
          isReturningUser,
          hasPreferredStrategies: preferredStrategies.length > 0,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Memory API error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function DELETE() {
  try {
    // Clear all memories (for privacy)
    conversationMemory.clearMemories()

    return new Response(
      JSON.stringify({
        success: true,
        message: "Memory cleared successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Memory clear error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
