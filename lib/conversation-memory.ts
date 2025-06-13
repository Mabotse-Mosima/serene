// Types for our memory system
export type MemoryItem = {
  type: MemoryType
  content: string
  timestamp: number
  importance: number // 1-10 scale
}

export type MemoryType =
  | "name"
  | "emotion"
  | "situation"
  | "person"
  | "coping_strategy"
  | "goal"
  | "preference"
  | "strength"
  | "challenge"
  | "achievement"

// Main memory store
export class ConversationMemory {
  private memories: MemoryItem[] = []
  private userName: string | null = null
  private recentEmotions: Map<string, number> = new Map() // emotion -> timestamp
  private mentionedTopics: Set<string> = new Set()
  private preferredCopingStrategies: Set<string> = new Set()
  private sessionStartTime: number

  constructor() {
    this.sessionStartTime = Date.now()
  }

  // Add a new memory item
  addMemory(type: MemoryType, content: string, importance = 5): void {
    // Special handling for names
    if (type === "name" && !this.userName) {
      this.userName = content
      importance = 10 // Names are very important
    }

    // Special handling for emotions
    if (type === "emotion") {
      this.recentEmotions.set(content.toLowerCase(), Date.now())
    }

    // Special handling for coping strategies
    if (type === "coping_strategy") {
      this.preferredCopingStrategies.add(content.toLowerCase())
    }

    // Add to general memories
    this.memories.push({
      type,
      content,
      timestamp: Date.now(),
      importance,
    })

    // Keep memories sorted by importance
    this.memories.sort((a, b) => b.importance - a.importance)

    // Cap the number of memories to prevent excessive growth
    if (this.memories.length > 50) {
      // Remove least important memories
      this.memories = this.memories.slice(0, 50)
    }
  }

  // Get the user's name if known
  getUserName(): string | null {
    return this.userName
  }

  // Get recent emotions (within the last hour)
  getRecentEmotions(): string[] {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const emotions: string[] = []

    this.recentEmotions.forEach((timestamp, emotion) => {
      if (timestamp > oneHourAgo) {
        emotions.push(emotion)
      }
    })

    return emotions
  }

  // Get the most recent emotion
  getMostRecentEmotion(): string | null {
    let mostRecent: { emotion: string; timestamp: number } | null = null

    this.recentEmotions.forEach((timestamp, emotion) => {
      if (!mostRecent || timestamp > mostRecent.timestamp) {
        mostRecent = { emotion, timestamp }
      }
    })

    return mostRecent ? mostRecent.emotion : null
  }

  // Get preferred coping strategies
  getPreferredCopingStrategies(): string[] {
    return Array.from(this.preferredCopingStrategies)
  }

  // Get relevant memories based on a query
  getRelevantMemories(query: string, limit = 3): MemoryItem[] {
    // Simple relevance scoring based on word matching
    const queryWords = new Set(query.toLowerCase().split(/\s+/))

    const scoredMemories = this.memories.map((memory) => {
      const memoryWords = new Set(memory.content.toLowerCase().split(/\s+/))
      let score = 0

      // Count matching words
      queryWords.forEach((word) => {
        if (memoryWords.has(word) || memory.content.toLowerCase().includes(word)) {
          score += 1
        }
      })

      // Boost by importance
      score *= memory.importance / 5

      // Recency boost (more recent = higher score)
      const hoursSinceMemory = (Date.now() - memory.timestamp) / (1000 * 60 * 60)
      const recencyFactor = Math.max(0, 1 - hoursSinceMemory / 24) // Decay over 24 hours
      score *= 1 + recencyFactor

      return { memory, score }
    })

    // Sort by score and return top memories
    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, limit)
      .map((item) => item.memory)
  }

  // Get session duration in minutes
  getSessionDuration(): number {
    return Math.floor((Date.now() - this.sessionStartTime) / (1000 * 60))
  }

  // Check if this is a returning user (has memories from previous session)
  isReturningUser(): boolean {
    return this.memories.length > 0 && this.getSessionDuration() > 30
  }

  // Clear all memories (for privacy)
  clearMemories(): void {
    this.memories = []
    this.userName = null
    this.recentEmotions.clear()
    this.mentionedTopics.clear()
    this.preferredCopingStrategies.clear()
  }
}

// Create a singleton instance
export const conversationMemory = new ConversationMemory()
