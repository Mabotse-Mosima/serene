"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test")
      const data = await response.json()

      if (data.success) {
        setResult(data.message)
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Hugging Face API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAPI} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
            {loading ? "Testing..." : "Test Hugging Face Connection"}
          </Button>

          {result && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg">
              <p className="font-medium">Success!</p>
              <p>Response: {result}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>This test checks if the Hugging Face API is working correctly.</p>
            <p>
              Visit <code className="bg-gray-100 px-1 rounded">/test</code> to run this test.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
