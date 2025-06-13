"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Send, Menu, Heart, Info, AlertCircle, RefreshCw, Trash2 } from "lucide-react"
import MoodTracker from "@/components/mood-tracker"
import CopingStrategies from "@/components/coping-strategies"
import BreathingExercise from "@/components/breathing-exercise"
import ResourcesSection from "@/components/resources-section"
import { useToast } from "@/components/ui/use-toast"

export default function SupportCompanion() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Hi there, I'm here to listen and support you. How are you feeling today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memoryStats, setMemoryStats] = useState<any>(null)
  const messagesEndRef = useRef(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Fetch memory stats periodically
  useEffect(() => {
    const fetchMemoryStats = async () => {
      try {
        const response = await fetch("/api/memory")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setMemoryStats(data.memoryStats)
          }
        }
      } catch (err) {
        console.error("Failed to fetch memory stats:", err)
      }
    }

    // Fetch initially
    fetchMemoryStats()

    // Then fetch every 30 seconds
    const interval = setInterval(fetchMemoryStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Reset error state
    setError(null)

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      // Add an empty assistant message that we'll update
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ])

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and append to the message
        const chunk = decoder.decode(value)
        assistantMessage += chunk

        // Update the assistant message
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: assistantMessage } : m)))
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to get a response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const retryLastMessage = async () => {
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUserMessage) return

    // Remove the last assistant message if it exists
    const hasAssistantResponse = messages[messages.length - 1].role === "assistant"
    if (hasAssistantResponse) {
      setMessages(messages.slice(0, -1))
    }

    // Reset error and set loading
    setError(null)
    setIsLoading(true)

    try {
      // Get messages up to the last user message
      const messagesToSend = messages.filter(
        (_, index) => index <= messages.findIndex((m) => m.id === lastUserMessage.id),
      )

      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      // Add an empty assistant message that we'll update
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ])

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and append to the message
        const chunk = decoder.decode(value)
        assistantMessage += chunk

        // Update the assistant message
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: assistantMessage } : m)))
      }
    } catch (err) {
      console.error("Error retrying message:", err)
      setError("Failed to get a response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearMemory = async () => {
    try {
      const response = await fetch("/api/memory", {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Memory cleared",
          description: "Your conversation data has been cleared for privacy.",
        })
        // Reset messages to just the welcome message
        setMessages([
          {
            id: "welcome-message-new",
            role: "assistant",
            content: "Hi there, I'm here to listen and support you. How are you feeling today?",
          },
        ])
      } else {
        toast({
          title: "Error",
          description: "Failed to clear memory. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error clearing memory:", err)
      toast({
        title: "Error",
        description: "Failed to clear memory. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center mb-8 mt-4">
            <Heart className="h-6 w-6 text-purple-500 mr-2" />
            <h1 className="text-xl font-semibold text-purple-700">Serene</h1>
          </div>

          <Tabs defaultValue="tools" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="tools" className="space-y-4 mt-4">
              <MoodTracker />
              <BreathingExercise />
              <CopingStrategies />
            </TabsContent>
            <TabsContent value="resources">
              <ResourcesSection />
            </TabsContent>
          </Tabs>

          <div className="mt-auto pt-4 border-t text-xs text-gray-500">
            <p className="mb-2 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not a substitute for professional help
            </p>
            <p>© 2025 Serene Support Companion</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <header className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={clearMemory}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Data
            </Button>
            <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
              <Info className="h-4 w-4 mr-1" />
              Help
            </Button>
          </div>
        </header>

        <Card className="flex-1 flex flex-col shadow-md border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 pb-4">
            <CardTitle className="text-purple-800 text-center">Your Supportive Space</CardTitle>
            <CardDescription className="text-center text-purple-600">
              A safe place to share your thoughts and feelings
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-purple-100 text-purple-800 p-3 rounded-lg text-sm mb-6">
              <strong>Enhanced Memory:</strong> This app now remembers details from your conversation to provide more
              personalized support. Your privacy is important - use the "Clear Data" button to remove all stored
              information at any time.
            </div>

            {memoryStats && memoryStats.isReturningUser && (
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-6">
                Welcome back! I remember our previous conversation.
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    m.role === "user"
                      ? "bg-purple-100 text-purple-900 rounded-tr-none"
                      : "bg-blue-100 text-blue-900 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-blue-100 text-blue-900 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
                <div className="font-medium mb-1">Error:</div>
                <div>{error}</div>
                <Button
                  onClick={retryLastMessage}
                  size="sm"
                  variant="outline"
                  className="mt-2 text-red-800 border-red-300 hover:bg-red-50"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Try Again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t border-purple-100">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Share how you're feeling..."
                className="flex-grow border-purple-200 focus-visible:ring-purple-400"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
