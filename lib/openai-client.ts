import { createOpenAI } from "@ai-sdk/openai"

// Create a configured OpenAI client
export const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1", // Default OpenAI API URL
  // Add any other required configuration for project API keys
})
