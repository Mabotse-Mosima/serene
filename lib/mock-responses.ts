// Pre-defined responses for common mental health topics
export const mockResponses = {
  // Greeting patterns
  greetings: [
    "Hello! How are you feeling today?",
    "Hi there. I'm here to listen. How are you doing?",
    "Welcome. How are you feeling at the moment?",
    "I'm here for you. How are things going today?",
  ],

  // Responses for different emotions
  emotions: {
    sad: [
      "I'm sorry to hear you're feeling sad. Would you like to talk about what's causing these feelings?",
      "It's okay to feel sad sometimes. Is there something specific that's bringing you down?",
      "I'm here for you during this difficult time. Would sharing what's on your mind help?",
      "Sadness is a natural emotion. Would you like to explore some gentle ways to care for yourself right now?",
    ],
    anxious: [
      "It sounds like you're feeling anxious. Would taking a few deep breaths together help?",
      "Anxiety can be really challenging. Is there something specific that's worrying you?",
      "When you're feeling anxious, it can help to ground yourself. Would you like to try a simple grounding exercise?",
      "I understand anxiety can be overwhelming. Would it help to talk about what's causing these feelings?",
    ],
    angry: [
      "I can see you're feeling frustrated. Would you like to talk about what happened?",
      "It's okay to feel angry. Would expressing what's bothering you help?",
      "Anger is often a response to feeling hurt or threatened. Would you like to explore what might be beneath this feeling?",
      "When we're angry, it can help to take a moment. Would you like to try a calming technique?",
    ],
    happy: [
      "I'm glad to hear you're feeling good! What's bringing you joy today?",
      "That's wonderful! Would you like to share more about what's making you happy?",
      "It's great that you're feeling positive. How can we build on this good energy?",
      "I'm happy to hear that! Celebrating positive moments is important. What made today special?",
    ],
    tired: [
      "It sounds like you're feeling drained. Have you been able to rest lately?",
      "Feeling tired can affect us in many ways. Would you like to talk about what might be causing this fatigue?",
      "Taking care of your energy is important. Would you like to explore some gentle self-care ideas?",
      "Rest is essential for wellbeing. Is there something making it difficult for you to recharge?",
    ],
  },

  // Coping strategies
  coping: [
    "Have you tried taking a few deep breaths when you feel overwhelmed? Breathing slowly can help calm your nervous system.",
    "Sometimes a short walk outside can help shift your perspective. Nature has a way of soothing our minds.",
    "Writing down your thoughts can be a helpful way to process them. Have you tried journaling?",
    "Talking to someone you trust about how you're feeling can often lighten the emotional load.",
    "Practicing mindfulness - simply noticing your surroundings and sensations without judgment - can help ground you in the present moment.",
    "Setting small, achievable goals can help when things feel overwhelming. What's one tiny step you could take today?",
    "Being kind to yourself during difficult times is so important. How would you comfort a friend in your situation?",
    "Creating a simple routine can provide stability when things feel uncertain. Even small habits can help.",
  ],

  // General supportive statements
  supportive: [
    "I'm here to listen whenever you need someone to talk to.",
    "Your feelings are valid, and it's okay to experience them.",
    "You're not alone in this, even when it might feel that way.",
    "Taking things one moment at a time is perfectly okay.",
    "It takes courage to share how you're feeling. Thank you for trusting me with that.",
    "Remember that difficult feelings will pass, even when they seem overwhelming right now.",
    "You're doing the best you can with what you have right now, and that's enough.",
    "Small steps forward are still progress. Be gentle with yourself along the way.",
  ],

  // Responses when the AI doesn't understand
  fallback: [
    "I'm here to listen. Could you tell me more about what you're experiencing?",
    "I want to understand better. Could you share a bit more about what's on your mind?",
    "I'm listening. Would you feel comfortable elaborating on that?",
    "I'm here to support you. Would you like to share more about what you're going through?",
  ],
}

// Helper function to get a random response from an array
export function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}

// Function to analyze text and return appropriate mock response
export function generateMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  // Check for emotional keywords
  if (message.match(/sad|unhappy|depressed|down|blue|crying|tears|upset/)) {
    return getRandomResponse(mockResponses.emotions.sad)
  }

  if (message.match(/anxious|worried|nervous|stress|panic|fear|scared|afraid/)) {
    return getRandomResponse(mockResponses.emotions.anxious)
  }

  if (message.match(/angry|mad|frustrated|annoyed|irritated|furious|rage/)) {
    return getRandomResponse(mockResponses.emotions.angry)
  }

  if (message.match(/happy|good|great|wonderful|amazing|joy|excited|pleased/)) {
    return getRandomResponse(mockResponses.emotions.happy)
  }

  if (message.match(/tired|exhausted|fatigue|drained|no energy|sleepy|burnout/)) {
    return getRandomResponse(mockResponses.emotions.tired)
  }

  // Check for questions about coping
  if (message.match(/how|what|cope|deal|manage|handle|advice|help|tip/)) {
    return getRandomResponse(mockResponses.coping)
  }

  // Default to supportive statements or fallback
  return Math.random() > 0.5 ? getRandomResponse(mockResponses.supportive) : getRandomResponse(mockResponses.fallback)
}
