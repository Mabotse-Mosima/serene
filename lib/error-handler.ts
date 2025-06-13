// Helper function to safely extract error messages
export function errorHandler(error: unknown): string {
  if (error == null) {
    return "Unknown error occurred"
  }
  if (typeof error === "string") {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }
  return JSON.stringify(error)
}
