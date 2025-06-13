export async function GET() {
  try {
    // Test the local mock AI client
    return new Response(
      JSON.stringify({
        success: true,
        message: "Local AI simulation is working correctly. No API key required!",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("API test error:", error)

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
