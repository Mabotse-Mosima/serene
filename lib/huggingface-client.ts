// Helper function to call Hugging Face Inference API
export async function callHuggingFaceAPI(messages: any[]) {
  try {
    // Format conversation history for the model
    const formattedPrompt = formatConversationForHuggingFace(messages)

    // Call Hugging Face API
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No API key required for public models with anonymous access
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        options: {
          wait_for_model: true, // Wait if the model is loading
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()

    // Extract the generated response
    return result.generated_text || "I'm here to listen and support you."
  } catch (error) {
    console.error("Hugging Face API error:", error)
    // Return a fallback response if the API fails
    return "I'm here to support you. It seems I'm having trouble connecting right now, but I'm still listening."
  }
}

// Format conversation history for Hugging Face models
function formatConversationForHuggingFace(messages: any[]): string {
  // Get only the last few messages to stay within context limits
  const recentMessages = messages.slice(-6)

  // Extract the system message if it exists
  const systemMessage = messages.find((msg) => msg.role === "system")

  // Start with the system message if it exists
  let prompt = systemMessage
    ? `Instructions: ${systemMessage.content}\n\n`
    : `Instructions: You are a supportive, empathetic companion designed to provide emotional support. Be warm, compassionate, and non-judgmental. Listen actively and validate feelings. Offer gentle encouragement and positive reinforcement. Suggest simple coping strategies when appropriate. Use a calm, reassuring tone. Never diagnose medical conditions.\n\n`

  // Add the conversation history
  recentMessages.forEach((msg) => {
    if (msg.role !== "system") {
      prompt += `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}\n`
    }
  })

  // Add the final prompt for the assistant to continue
  prompt += "Assistant:"

  return prompt
}
