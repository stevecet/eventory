"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (message: WebSocketMessage) => void
  lastMessage: WebSocketMessage | null
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

interface WebSocketProviderProps {
  children: ReactNode
  url?: string
  enableMockData?: boolean
}

export default function WebSocketProvider({
  children,
  url = "wss://echo.websocket.org",
  enableMockData = true,
}: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const mockDataIntervalRef = useRef<NodeJS.Timeout>()
  const maxReconnectAttempts = 3

  const isValidJSON = (str: string): boolean => {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  const connect = () => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    setConnectionStatus("connecting")

    try {
      // Check if WebSocket is supported
      if (typeof WebSocket === "undefined") {
        console.warn("WebSocket is not supported in this environment")
        setConnectionStatus("error")
        startMockData()
        return
      }

      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log("WebSocket connected to:", url)
        setIsConnected(true)
        setConnectionStatus("connected")
        setReconnectAttempts(0)
        setSocket(ws)

        toast({
          title: "Connected",
          description: "Real-time updates are now active",
        })

        // Send a test message to verify connection
        const testMessage = {
          type: "CONNECTION_TEST",
          data: { clientId: Math.random().toString(36).substr(2, 9) },
          timestamp: new Date().toISOString(),
        }
        ws.send(JSON.stringify(testMessage))
      }

      ws.onmessage = (event) => {
        try {
          const messageData = event.data

          // Handle different types of WebSocket responses
          if (typeof messageData === "string") {
            // Check if it's valid JSON
            if (isValidJSON(messageData)) {
              try {
                const message: WebSocketMessage = JSON.parse(messageData)
                setLastMessage(message)
                handleMessage(message)
              } catch (parseError) {
                console.error("Error parsing JSON message:", parseError)
                // Create a fallback message for invalid JSON
                const fallbackMessage: WebSocketMessage = {
                  type: "PARSE_ERROR",
                  data: { rawMessage: messageData.substring(0, 100) },
                  timestamp: new Date().toISOString(),
                }
                setLastMessage(fallbackMessage)
              }
            } else {
              // Handle non-JSON string responses (like from echo servers)
              const message: WebSocketMessage = {
                type: "TEXT_RESPONSE",
                data: {
                  message: messageData.substring(0, 200), // Limit message length
                  isEcho: messageData.includes("CONNECTION_TEST") || messageData.includes("TEST_MESSAGE"),
                },
                timestamp: new Date().toISOString(),
              }
              setLastMessage(message)
              handleMessage(message)
            }
          } else if (messageData instanceof Blob) {
            // Handle Blob responses
            messageData
              .text()
              .then((text) => {
                const message: WebSocketMessage = {
                  type: "BLOB_RESPONSE",
                  data: { message: text.substring(0, 200) },
                  timestamp: new Date().toISOString(),
                }
                setLastMessage(message)
                handleMessage(message)
              })
              .catch((error) => {
                console.error("Error reading blob:", error)
              })
          } else {
            // Handle other data types
            const message: WebSocketMessage = {
              type: "UNKNOWN_RESPONSE",
              data: { message: "Received unknown data type" },
              timestamp: new Date().toISOString(),
            }
            setLastMessage(message)
            handleMessage(message)
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error)
          // Don't show error toast for parsing issues, just log them
        }
      }

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus("disconnected")
        setSocket(null)

        // Only attempt to reconnect if it wasn't a normal closure and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000) // Max 10 seconds
          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1)
            connect()
          }, delay)
        } else {
          console.log("Starting mock data mode")
          setConnectionStatus("error")
          startMockData()
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionStatus("error")

        // Start mock data immediately on error
        setTimeout(() => {
          if (connectionStatus !== "connected") {
            startMockData()
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      setConnectionStatus("error")
      startMockData()
    }
  }

  const startMockData = () => {
    if (enableMockData && !mockDataIntervalRef.current) {
      console.log("Starting mock data simulation")
      setIsConnected(true) // Simulate connection for demo
      setConnectionStatus("connected")

      toast({
        title: "Demo Mode",
        description: "Using simulated real-time data",
      })

      // Generate mock messages every 5-15 seconds
      const generateMockMessage = () => {
        const mockMessages = [
          {
            type: "NEW_REGISTRATION",
            data: {
              attendeeName: `User ${Math.floor(Math.random() * 1000)}`,
              eventTitle: `Event ${Math.floor(Math.random() * 100)}`,
              ticketPrice: Math.floor(Math.random() * 100) + 20,
            },
          },
          {
            type: "EVENT_CREATED",
            data: {
              title: `New Event ${Math.floor(Math.random() * 100)}`,
              organizer: `Organizer ${Math.floor(Math.random() * 50)}`,
            },
          },
          {
            type: "USER_STATUS_CHANGE",
            data: {
              userName: `User ${Math.floor(Math.random() * 1000)}`,
              status: Math.random() > 0.5 ? "active" : "inactive",
            },
          },
          {
            type: "ATTENDEE_COUNT_UPDATE",
            data: {
              eventId: Math.floor(Math.random() * 100),
              newCount: Math.floor(Math.random() * 500) + 10,
            },
          },
        ]

        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]
        const message: WebSocketMessage = {
          ...randomMessage,
          timestamp: new Date().toISOString(),
        }

        setLastMessage(message)
        handleMessage(message)
      }

      // Initial message
      setTimeout(generateMockMessage, 2000)

      // Set up interval for ongoing messages
      mockDataIntervalRef.current = setInterval(generateMockMessage, Math.random() * 10000 + 5000)
    }
  }

  const stopMockData = () => {
    if (mockDataIntervalRef.current) {
      clearInterval(mockDataIntervalRef.current)
      mockDataIntervalRef.current = undefined
    }
  }

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "NEW_REGISTRATION":
        toast({
          title: "New Registration",
          description: `${message.data.attendeeName} registered for ${message.data.eventTitle}`,
        })
        break

      case "EVENT_CREATED":
        toast({
          title: "New Event Created",
          description: `${message.data.title} by ${message.data.organizer}`,
        })
        break

      case "EVENT_CANCELLED":
        toast({
          title: "Event Cancelled",
          description: `${message.data.title} has been cancelled`,
          variant: "destructive",
        })
        break

      case "ATTENDEE_COUNT_UPDATE":
        // Update attendee count in real-time (silent update)
        console.log("Attendee count updated:", message.data)
        break

      case "USER_STATUS_CHANGE":
        toast({
          title: "User Status Changed",
          description: `${message.data.userName} is now ${message.data.status}`,
        })
        break

      case "SYSTEM_ALERT":
        toast({
          title: "System Alert",
          description: message.data.message,
          variant: message.data.severity === "error" ? "destructive" : "default",
        })
        break

      case "CONNECTION_TEST":
        console.log("Connection test successful")
        break

      case "TEXT_RESPONSE":
        if (message.data.isEcho) {
          console.log("Echo response received:", message.data.message.substring(0, 50))
        } else {
          console.log("Text response:", message.data.message.substring(0, 50))
        }
        break

      case "PARSE_ERROR":
        console.warn("Received unparseable message:", message.data.rawMessage)
        break

      case "BLOB_RESPONSE":
      case "UNKNOWN_RESPONSE":
        console.log("Received non-standard response:", message.type)
        break

      default:
        console.log("Unhandled message type:", message.type)
    }
  }

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(message))
      } catch (error) {
        console.error("Error sending WebSocket message:", error)
        toast({
          title: "Send Error",
          description: "Failed to send message",
          variant: "destructive",
        })
      }
    } else if (enableMockData) {
      // In mock mode, echo the message back
      console.log("Mock send:", message)
      setTimeout(() => {
        const echoMessage: WebSocketMessage = {
          type: "TEXT_RESPONSE",
          data: {
            message: `Echo: ${JSON.stringify(message).substring(0, 100)}`,
            isEcho: true,
          },
          timestamp: new Date().toISOString(),
        }
        setLastMessage(echoMessage)
        handleMessage(echoMessage)
      }, 500)
    } else {
      console.warn("WebSocket is not connected")
      toast({
        title: "Connection Error",
        description: "Cannot send message - not connected",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Start connection attempt
    connect()

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      stopMockData()
      if (socket) {
        socket.close(1000, "Component unmounting")
      }
    }
  }, [])

  const contextValue: WebSocketContextType = {
    isConnected,
    sendMessage,
    lastMessage,
    connectionStatus,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
