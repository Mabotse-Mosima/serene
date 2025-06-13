import type { ConversationMemory, MemoryType } from "./conversation-memory"

// Patterns to extract different types of information
const extractionPatterns = {
  name: [/my name is (\w+)/i, /i'm (\w+)/i, /i am (\w+)/i, /call me (\w+)/i, /(\w+) is my name/i],

  emotion: [
    /i feel (\w+)/i,
    /i'm feeling (\w+)/i,
    /i am (\w+)/i,
    /i've been (\w+)/i,
    /i've been feeling (\w+)/i,
    /i feel so (\w+)/i,
  ],

  situation: [
    /dealing with ([\w\s]+)/i,
    /struggling with ([\w\s]+)/i,
    /going through ([\w\s]+)/i,
    /experiencing ([\w\s]+)/i,
    /having ([\w\s]+) problems/i,
    /having trouble with ([\w\s]+)/i,
    /having a hard time with ([\w\s]+)/i,
    /having difficulty with ([\w\s]+)/i,
  ],

  person: [/my (\w+) is ([\w\s]+)/i, /my (\w+) and i/i, /with my (\w+)/i],

  coping_strategy: [
    /helps me ([\w\s]+)/i,
    /i cope by ([\w\s]+)/i,
    /i find ([\w\s]+) helpful/i,
    /i like to ([\w\s]+) when/i,
    /i try to ([\w\s]+) when/i,
    /([\w\s]+) makes me feel better/i,
  ],

  goal: [
    /i want to ([\w\s]+)/i,
    /i'm trying to ([\w\s]+)/i,
    /i hope to ([\w\s]+)/i,
    /my goal is to ([\w\s]+)/i,
    /i wish i could ([\w\s]+)/i,
  ],

  preference: [
    /i prefer ([\w\s]+)/i,
    /i like ([\w\s]+)/i,
    /i enjoy ([\w\s]+)/i,
    /i love ([\w\s]+)/i,
    /i don't like ([\w\s]+)/i,
    /i hate ([\w\s]+)/i,
  ],

  strength: [/i'm good at ([\w\s]+)/i, /i excel at ([\w\s]+)/i, /my strength is ([\w\s]+)/i, /i can ([\w\s]+) well/i],

  challenge: [
    /i struggle with ([\w\s]+)/i,
    /i find it hard to ([\w\s]+)/i,
    /i have trouble ([\w\s]+)/i,
    /it's difficult for me to ([\w\s]+)/i,
    /i can't seem to ([\w\s]+)/i,
  ],

  achievement: [
    /i managed to ([\w\s]+)/i,
    /i was able to ([\w\s]+)/i,
    /i succeeded in ([\w\s]+)/i,
    /i accomplished ([\w\s]+)/i,
    /i'm proud that i ([\w\s]+)/i,
  ],
}

// Emotion words to check for
const emotionWords = {
  positive: [
    "happy",
    "glad",
    "joyful",
    "excited",
    "content",
    "peaceful",
    "calm",
    "relaxed",
    "grateful",
    "thankful",
    "proud",
    "confident",
    "hopeful",
    "optimistic",
    "relieved",
  ],
  negative: [
    "sad",
    "upset",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "angry",
    "frustrated",
    "disappointed",
    "hurt",
    "lonely",
    "afraid",
    "scared",
    "overwhelmed",
    "exhausted",
    "tired",
    "hopeless",
    "helpless",
    "guilty",
    "ashamed",
    "embarrassed",
    "jealous",
    "envious",
  ],
}

// Extract memories from a message
export function extractMemories(message: string, memory: ConversationMemory): void {
  // Check each pattern type
  for (const [type, patterns] of Object.entries(extractionPatterns)) {
    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match && match[1]) {
        // For person patterns, we need to extract relationship and name
        if (type === "person" && match[2]) {
          memory.addMemory(type as MemoryType, `${match[1]}: ${match[2]}`, 7)
        } else {
          // Determine importance based on type
          let importance = 5
          if (type === "name") importance = 10
          if (type === "emotion") importance = 8
          if (type === "situation") importance = 7

          memory.addMemory(type as MemoryType, match[1], importance)
        }
      }
    }
  }

  // Check for emotion words directly
  const words = message.toLowerCase().split(/\s+/)
  for (const word of words) {
    if (emotionWords.positive.includes(word)) {
      memory.addMemory("emotion", word, 8)
    } else if (emotionWords.negative.includes(word)) {
      memory.addMemory("emotion", word, 8)
    }
  }
}
