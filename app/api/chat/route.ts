import { generateResponse } from "@/lib/mock-ai-client"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format")
    }

    // Generate a response using our local mock AI client with memory
    const aiResponse = await generateResponse(messages)

    // Create a stream to simulate typing
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Split the response into words and stream them with delays
          const words = aiResponse.split(" ")
          for (const word of words) {
            controller.enqueue(encoder.encode(`${word} `))
            // Add a small delay between words to simulate typing
            await new Promise((resolve) => setTimeout(resolve, 30))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Return the streaming response
    return new Response(stream)
  } catch (error) {
    console.error("Error in chat API route:", error)
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error",
        message: "Failed to process chat request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
