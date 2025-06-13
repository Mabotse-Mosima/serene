// Advanced pattern-matching AI client that doesn't require API calls
// This simulates AI responses for a mental health support app

import { conversationMemory } from "./conversation-memory"
import { extractMemories } from "./memory-extractor"

// Types for our messages
type Role = "user" | "assistant" | "system"
type Message = { role: Role; content: string; id?: string }

// Categories of responses for different emotional states and topics
const responseTemplates = {
  greeting: [
    "Hello! How are you feeling today?",
    "Hi there. I'm here to listen. How are you doing?",
    "Welcome. How are you feeling at the moment?",
    "I'm here for you. How are things going today?",
  ],

  greeting_with_name: [
    "Hello, {name}! How are you feeling today?",
    "Hi {name}. I'm here to listen. How are you doing?",
    "Welcome back, {name}. How are you feeling at the moment?",
    "I'm here for you, {name}. How are things going today?",
  ],

  returning_user: [
    "It's good to see you again. How have you been since we last talked?",
    "Welcome back. How are you feeling today compared to our last conversation?",
    "I remember we spoke before. How have things been going since then?",
    "It's nice to continue our conversation. How have you been?",
  ],

  returning_user_with_name: [
    "It's good to see you again, {name}. How have you been since we last talked?",
    "Welcome back, {name}. How are you feeling today compared to our last conversation?",
    "I remember we spoke before, {name}. How have things been going since then?",
    "It's nice to continue our conversation, {name}. How have you been?",
  ],

  emotion_follow_up: [
    "Last time you mentioned feeling {emotion}. How are you feeling now?",
    "You shared that you were feeling {emotion} before. Has that changed?",
    "Previously you talked about feeling {emotion}. How's your emotional state today?",
    "I remember you were feeling {emotion}. How are things now?",
  ],

  situation_follow_up: [
    "You mentioned {situation} earlier. How is that going?",
    "Last time we talked about {situation}. Has there been any change?",
    "I remember you were dealing with {situation}. How is that situation now?",
    "You shared about {situation} before. Would you like to talk more about that?",
  ],

  coping_strategy_reminder: [
    "Previously you mentioned that {strategy} helps you. Have you been able to use that recently?",
    "You shared that {strategy} was helpful for you. Have you tried that lately?",
    "I remember you found {strategy} beneficial. Has that been helping recently?",
    "Last time you mentioned {strategy} as something that works for you. Have you been practicing that?",
  ],

  sadness: [
    "I'm sorry to hear you're feeling down. Would you like to talk about what's causing these feelings?",
    "It sounds like you're going through a difficult time. Remember that it's okay to feel sad sometimes.",
    "I'm here for you during this challenging period. Would sharing more about what's happening help?",
    "When we feel sad, it can be helpful to be gentle with ourselves. What might bring you a small moment of comfort right now?",
    "Sadness is a natural emotion that we all experience. Would it help to explore some ways to care for yourself during this time?",
  ],

  anxiety: [
    "It sounds like you're feeling anxious. Would taking a few deep breaths together help?",
    "Anxiety can be really challenging. Is there something specific that's worrying you?",
    "When anxiety rises, grounding techniques can help. Would you like to try focusing on five things you can see around you?",
    "I understand that anxiety can feel overwhelming. Would it help to break down what's causing these feelings?",
    "Sometimes anxiety comes from worrying about the future. Would it help to focus on what you can control right now?",
  ],

  anger: [
    "I can see you're feeling frustrated. Would you like to talk about what happened?",
    "It's okay to feel angry. Would expressing what's bothering you help?",
    "Anger often signals that something important to us has been threatened. What do you think might be beneath this feeling?",
    "When we're angry, it can help to take a moment. Would you like to try a calming technique?",
    "Your feelings are valid. Would it help to explore constructive ways to express this anger?",
  ],

  fear: [
    "It sounds like you're feeling scared. Remember that you're not alone in this.",
    "Fear can be very intense. Would you like to talk about what's frightening you?",
    "When we name our fears, sometimes they become less overwhelming. What specifically are you afraid might happen?",
    "It's natural to feel afraid sometimes. Would it help to explore some ways to feel safer?",
    "I'm here with you as you face this fear. What small step might help you feel more secure right now?",
  ],

  joy: [
    "I'm happy to hear you're feeling good! What's bringing you joy today?",
    "That sounds wonderful! Celebrating positive moments is important. What made today special?",
    "It's great that you're feeling positive. How can we build on this good energy?",
    "Moments of joy are precious. Would you like to share more about what's making you happy?",
    "I'm glad things are going well! What do you think contributed to these positive feelings?",
  ],

  gratitude: [
    "Practicing gratitude can be so powerful. What else are you thankful for today?",
    "That's a beautiful perspective. Noticing the good things, even small ones, can make a difference.",
    "Gratitude can help shift our focus. Are there other positive aspects you've noticed recently?",
    "I appreciate you sharing what you're grateful for. How does focusing on gratitude affect your mood?",
    "That's wonderful to recognize. Gratitude can be like a muscle that gets stronger with practice.",
  ],

  coping: [
    "Deep breathing can help calm your nervous system. Try breathing in for 4 counts, holding for 7, and exhaling for 8.",
    "Grounding exercises can help when emotions feel overwhelming. Can you name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste?",
    "Sometimes a short walk outside can help shift your perspective. Nature has a way of soothing our minds.",
    "Writing down your thoughts can be a helpful way to process them. Have you tried journaling?",
    "Setting small, achievable goals can help when things feel overwhelming. What's one tiny step you could take today?",
    "Being kind to yourself during difficult times is important. How would you comfort a friend in your situation?",
    "Creating a simple routine can provide stability when things feel uncertain. Even small habits can help.",
    "Mindfulness practices can help bring you back to the present moment when worries about the past or future take over.",
  ],

  validation: [
    "What you're feeling is completely valid.",
    "It makes sense that you would feel that way given what you're experiencing.",
    "Your emotions are providing you with important information.",
    "Many people would feel similarly in your situation.",
    "It sounds like you've been dealing with a lot. It's natural to have these feelings.",
  ],

  encouragement: [
    "You've shown resilience in difficult situations before.",
    "Each small step forward matters, even if progress feels slow.",
    "I believe in your ability to navigate this challenge.",
    "You have inner strengths that can help you through this time.",
    "Remember that healing and growth aren't linear processes - ups and downs are normal.",
  ],

  reflection: [
    "It sounds like you're saying that...",
    "If I understand correctly, you're feeling...",
    "So from your perspective...",
    "It seems like this situation has made you feel...",
    "I'm hearing that you're experiencing...",
  ],

  openQuestions: [
    "Could you tell me more about that?",
    "How did that make you feel?",
    "What thoughts come up for you when that happens?",
    "What would be helpful for you right now?",
    "What have you found helpful in similar situations before?",
  ],

  selfCare: [
    "Have you been able to take care of your basic needs today, like eating and resting?",
    "Sometimes small acts of self-care can make a difference. Is there something gentle you could do for yourself today?",
    "Taking breaks is important. Have you given yourself permission to rest?",
    "Our bodies and minds are connected. Has movement or physical activity been helpful for you?",
    "Setting boundaries is an important form of self-care. Is there anywhere you might need to establish or reinforce boundaries?",
  ],

  professional: [
    "While I'm here to support you, speaking with a mental health professional can provide specialized help. Have you considered that option?",
    "A therapist or counselor could offer strategies specifically tailored to your situation. Would you like to explore resources for finding professional support?",
    "Professional support can be valuable, especially during challenging times. Would information about affordable mental health services be helpful?",
    "There are many different approaches to therapy. Would you like to learn about some options that might fit your needs?",
    "Your wellbeing is important. A healthcare provider could help assess what support might be most beneficial for you.",
  ],

  crisis: [
    "I'm concerned about what you're sharing. If you're in immediate danger, please contact emergency services or a crisis helpline like 988 in the US.",
    "Your safety is the top priority. Please reach out to someone who can provide immediate support, like a crisis text line or local emergency services.",
    "These feelings are serious and deserve immediate attention from trained professionals. The 988 Suicide & Crisis Lifeline is available 24/7.",
    "You don't have to face this alone. Crisis counselors are available right now who are trained to help with exactly these situations.",
    "This sounds urgent. Please connect with emergency services or call 988 for immediate support from trained crisis counselors.",
  ],

  fallback: [
    "I'm here to listen. Could you tell me more about what you're experiencing?",
    "I want to understand better. Could you share a bit more about what's on your mind?",
    "I'm listening. Would you feel comfortable elaborating on that?",
    "I'm here to support you. Would you like to share more about what you're going through?",
    "Thank you for sharing that with me. How else have you been feeling lately?",
  ],
}

// Keywords to identify emotional states and topics
const keywords = {
  sadness: [
    "sad",
    "unhappy",
    "depressed",
    "down",
    "blue",
    "crying",
    "tears",
    "upset",
    "miserable",
    "heartbroken",
    "grief",
    "mourning",
    "gloomy",
    "hopeless",
    "despair",
    "melancholy",
    "sorrow",
    "hurt",
  ],

  anxiety: [
    "anxious",
    "worried",
    "nervous",
    "stress",
    "panic",
    "fear",
    "scared",
    "afraid",
    "uneasy",
    "tense",
    "overwhelmed",
    "overthinking",
    "restless",
    "apprehensive",
    "dread",
    "jittery",
    "on edge",
  ],

  anger: [
    "angry",
    "mad",
    "frustrated",
    "annoyed",
    "irritated",
    "furious",
    "rage",
    "resentment",
    "hostile",
    "bitter",
    "enraged",
    "outraged",
    "hate",
    "dislike",
    "fed up",
    "bothered",
    "irked",
  ],

  fear: [
    "afraid",
    "scared",
    "terrified",
    "fearful",
    "frightened",
    "alarmed",
    "panicked",
    "threatened",
    "worried",
    "concerned",
    "dreading",
    "horror",
    "terror",
    "phobia",
    "intimidated",
  ],

  joy: [
    "happy",
    "good",
    "great",
    "wonderful",
    "amazing",
    "joy",
    "excited",
    "pleased",
    "delighted",
    "content",
    "cheerful",
    "thrilled",
    "elated",
    "glad",
    "satisfied",
    "positive",
    "fantastic",
    "excellent",
  ],

  gratitude: [
    "grateful",
    "thankful",
    "appreciate",
    "blessed",
    "fortunate",
    "lucky",
    "appreciative",
    "moved",
    "touched",
    "honored",
    "indebted",
    "recognition",
    "acknowledgment",
  ],

  coping: [
    "cope",
    "deal",
    "manage",
    "handle",
    "strategy",
    "technique",
    "method",
    "way",
    "approach",
    "solution",
    "help",
    "advice",
    "suggestion",
    "tip",
    "guidance",
    "direction",
    "support",
    "resource",
  ],

  selfCare: [
    "self-care",
    "care",
    "rest",
    "sleep",
    "eat",
    "food",
    "exercise",
    "move",
    "break",
    "pause",
    "relax",
    "calm",
    "soothe",
    "comfort",
    "nurture",
    "nourish",
    "recharge",
    "restore",
    "replenish",
  ],

  crisis: [
    "suicide",
    "kill",
    "die",
    "death",
    "end",
    "harm",
    "hurt",
    "pain",
    "emergency",
    "crisis",
    "helpline",
    "hotline",
    "lifeline",
    "danger",
    "unsafe",
    "desperate",
    "hopeless",
    "pointless",
    "worthless",
  ],

  greeting: [
    "hello",
    "hi",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "what's up",
    "how are you",
    "how's it going",
    "how do you do",
  ],
}

// Function to analyze message content and determine the most appropriate response category
function analyzeMessage(message: string): string[] {
  const lowerMessage = message.toLowerCase()
  const categories: string[] = []

  // Check for crisis keywords first - highest priority
  if (keywords.crisis.some((word) => lowerMessage.includes(word))) {
    return ["crisis"]
  }

  // Check for greeting patterns
  if (keywords.greeting.some((word) => lowerMessage.includes(word)) && lowerMessage.length < 20) {
    categories.push("greeting")
  }

  // Check for emotional states
  for (const [category, words] of Object.entries(keywords)) {
    if (category !== "crisis" && category !== "greeting") {
      // Already checked these
      if (words.some((word) => lowerMessage.includes(word))) {
        categories.push(category)
      }
    }
  }

  // If asking a question, add open questions category
  if (
    lowerMessage.includes("?") ||
    lowerMessage.startsWith("how") ||
    lowerMessage.startsWith("what") ||
    lowerMessage.startsWith("why") ||
    lowerMessage.startsWith("when") ||
    lowerMessage.startsWith("where") ||
    lowerMessage.startsWith("can") ||
    lowerMessage.startsWith("could") ||
    lowerMessage.startsWith("would")
  ) {
    categories.push("openQuestions")
  }

  // Always add validation and reflection as potential response types
  categories.push("validation", "reflection")

  // If no specific categories were identified, use fallback
  if (
    categories.length === 0 ||
    (categories.length === 2 && categories.includes("validation") && categories.includes("reflection"))
  ) {
    categories.push("fallback")
  }

  return categories
}

// Function to generate a response based on conversation history
export async function generateResponse(messages: Message[]): Promise<string> {
  try {
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

    if (!lastUserMessage) {
      return getRandomResponse(responseTemplates.greeting)
    }

    // Extract memories from the user message
    extractMemories(lastUserMessage.content, conversationMemory)

    // Analyze the message content
    const categories = analyzeMessage(lastUserMessage.content)

    // Build a response by combining elements from different categories
    let response = ""

    // If crisis is detected, that's the only response we send
    if (categories.includes("crisis")) {
      return getRandomResponse(responseTemplates.crisis)
    }

    // Check if we should use personalized greeting
    const userName = conversationMemory.getUserName()
    const isReturningUser = conversationMemory.isReturningUser()
    const recentEmotion = conversationMemory.getMostRecentEmotion()

    // Handle greetings with memory
    if (categories.includes("greeting") && lastUserMessage.content.length < 20) {
      if (isReturningUser && userName) {
        return getRandomResponse(responseTemplates.returning_user_with_name).replace("{name}", userName)
      } else if (isReturningUser) {
        return getRandomResponse(responseTemplates.returning_user)
      } else if (userName) {
        return getRandomResponse(responseTemplates.greeting_with_name).replace("{name}", userName)
      } else {
        return getRandomResponse(responseTemplates.greeting)
      }
    }

    // Get relevant memories for this conversation
    const relevantMemories = conversationMemory.getRelevantMemories(lastUserMessage.content)

    // Start with personalized acknowledgment if we have a name
    if (userName && Math.random() > 0.7) {
      response += `${userName}, `
    }

    // Reference previous emotion if appropriate
    if (recentEmotion && Math.random() > 0.8 && !categories.includes(recentEmotion)) {
      response += getRandomResponse(responseTemplates.emotion_follow_up).replace("{emotion}", recentEmotion) + " "
    }

    // Reference a relevant memory if available
    if (relevantMemories.length > 0 && Math.random() > 0.7) {
      const memory = relevantMemories[0]
      if (memory.type === "situation") {
        response +=
          getRandomResponse(responseTemplates.situation_follow_up).replace("{situation}", memory.content) + " "
      } else if (memory.type === "coping_strategy" && Math.random() > 0.5) {
        response +=
          getRandomResponse(responseTemplates.coping_strategy_reminder).replace("{strategy}", memory.content) + " "
      }
    }

    // For other messages, build a more complex response
    // Start with reflection or validation
    if (response.length < 10) {
      if (categories.includes("reflection") && Math.random() > 0.5) {
        response += getRandomResponse(responseTemplates.reflection) + " "
      } else if (categories.includes("validation")) {
        response += getRandomResponse(responseTemplates.validation) + " "
      }
    }

    // Add emotional support based on detected emotions
    for (const emotion of ["sadness", "anxiety", "anger", "fear", "joy", "gratitude"]) {
      if (categories.includes(emotion)) {
        response += getRandomResponse(responseTemplates[emotion]) + " "
        break // Only use one emotion response
      }
    }

    // If no emotion was addressed yet, add a general response
    if (!response || response.length < 10) {
      response += getRandomResponse(responseTemplates.fallback) + " "
    }

    // Add coping strategies or self-care advice if relevant
    if (categories.includes("coping")) {
      response += getRandomResponse(responseTemplates.coping) + " "
    } else if (categories.includes("selfCare")) {
      response += getRandomResponse(responseTemplates.selfCare) + " "
    }

    // Add encouragement to most responses
    if (Math.random() > 0.7) {
      response += getRandomResponse(responseTemplates.encouragement)
    }

    // Add an open question if the response doesn't already end with a question
    if (!response.trim().endsWith("?") && Math.random() > 0.5) {
      response += " " + getRandomResponse(responseTemplates.openQuestions)
    }

    // If the response got too long, just use a focused response from the most relevant category
    if (response.length > 300) {
      const primaryCategory =
        categories[0] === "reflection" || categories[0] === "validation" ? categories[1] || "fallback" : categories[0]

      response = getRandomResponse(responseTemplates[primaryCategory])

      // Add an open question if it doesn't end with one
      if (!response.endsWith("?")) {
        response += " " + getRandomResponse(responseTemplates.openQuestions)
      }
    }

    return response.trim()
  } catch (error) {
    console.error("Error generating response:", error)
    return "I'm here to listen and support you. Would you like to share more about how you're feeling?"
  }
}

// Helper function to get a random response from an array
function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}
