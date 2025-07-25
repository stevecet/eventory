"use client"

import { useEffect, useState } from "react"
import { Bell, Users, Calendar, TrendingUp, Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "./websocket-provider"

interface LiveUpdate {
  id: string
  type:
    | "registration"
    | "event_created"
    | "event_cancelled"
    | "user_joined"
    | "user_status_change"
    | "text_response"
    | "system"
  message: string
  timestamp: string
  data: any
}

interface LiveStats {
  activeUsers: number
  totalRegistrations: number
  eventsToday: number
  revenue: number
}

export default function RealTimeUpdates() {
  const { isConnected, lastMessage, connectionStatus, sendMessage } = useWebSocket()
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([])
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeUsers: 1247,
    totalRegistrations: 3456,
    eventsToday: 12,
    revenue: 45678,
  })

  useEffect(() => {
    if (lastMessage) {
      const update: LiveUpdate = {
        id: Math.random().toString(36).substr(2, 9),
        type: getUpdateType(lastMessage.type),
        message: formatMessage(lastMessage),
        timestamp: lastMessage.timestamp,
        data: lastMessage.data,
      }

      setLiveUpdates((prev) => [update, ...prev.slice(0, 9)]) // Keep last 10 updates

      // Update live stats based on message type
      updateLiveStats(lastMessage)
    }
  }, [lastMessage])

  const getUpdateType = (messageType: string): LiveUpdate["type"] => {
    switch (messageType) {
      case "NEW_REGISTRATION":
        return "registration"
      case "EVENT_CREATED":
        return "event_created"
      case "EVENT_CANCELLED":
        return "event_cancelled"
      case "USER_STATUS_CHANGE":
        return "user_status_change"
      case "TEXT_RESPONSE":
        return "text_response"
      default:
        return "system"
    }
  }

  const formatMessage = (message: any) => {
    switch (message.type) {
      case "NEW_REGISTRATION":
        return `${message.data.attendeeName} registered for ${message.data.eventTitle}`
      case "EVENT_CREATED":
        return `New event "${message.data.title}" created by ${message.data.organizer}`
      case "EVENT_CANCELLED":
        return `Event "${message.data.title}" was cancelled`
      case "USER_STATUS_CHANGE":
        return `${message.data.userName} status changed to ${message.data.status}`
      case "TEXT_RESPONSE":
        if (message.data.isEcho) {
          return `Echo response received`
        }
        return `Server response: ${message.data.message.substring(0, 50)}...`
      case "CONNECTION_TEST":
        return "Connection test successful"
      case "PARSE_ERROR":
        return "Received malformed message from server"
      case "BLOB_RESPONSE":
        return "Received binary data from server"
      case "UNKNOWN_RESPONSE":
        return "Received unknown data type from server"
      default:
        return "System update received"
    }
  }

  const updateLiveStats = (message: any) => {
    switch (message.type) {
      case "NEW_REGISTRATION":
        setLiveStats((prev) => ({
          ...prev,
          totalRegistrations: prev.totalRegistrations + 1,
          revenue: prev.revenue + (message.data.ticketPrice || 0),
        }))
        break
      case "EVENT_CREATED":
        setLiveStats((prev) => ({
          ...prev,
          eventsToday: prev.eventsToday + 1,
        }))
        break
      case "USER_STATUS_CHANGE":
        if (message.data.status === "active") {
          setLiveStats((prev) => ({
            ...prev,
            activeUsers: prev.activeUsers + 1,
          }))
        }
        break
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <Users className="h-4 w-4 text-green-600" />
      case "event_created":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "event_cancelled":
        return <Calendar className="h-4 w-4 text-red-600" />
      case "text_response":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      case "system":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case "registration":
        return "border-l-green-500"
      case "event_created":
        return "border-l-blue-500"
      case "event_cancelled":
        return "border-l-red-500"
      case "text_response":
        return "border-l-purple-500"
      case "system":
        return "border-l-orange-500"
      default:
        return "border-l-gray-500"
    }
  }

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "connecting":
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 animate-pulse" />
            <Badge className="bg-yellow-600">Connecting...</Badge>
          </div>
        )
      case "connected":
        return (
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-600" />
            <Badge className="bg-green-600">Connected</Badge>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <Badge className="bg-orange-600">Demo Mode</Badge>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4 text-red-600" />
            <Badge variant="destructive">Disconnected</Badge>
          </div>
        )
    }
  }

  const testWebSocket = () => {
    const testMessage = {
      type: "TEST_MESSAGE",
      data: {
        message: "Test message from admin dashboard",
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
    sendMessage(testMessage)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Real-time Status</CardTitle>
            {getConnectionStatusBadge()}
          </div>
          <CardDescription>
            {connectionStatus === "error"
              ? "Using simulated data for demonstration purposes"
              : connectionStatus === "connecting"
                ? "Establishing connection to real-time server..."
                : "Live connection to real-time updates"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Live Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.activeUsers.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.totalRegistrations.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.eventsToday}</div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${liveStats.revenue.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>Real-time updates from across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liveUpdates.length > 0 ? (
              liveUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`flex items-start space-x-3 p-3 border-l-4 bg-gray-50 rounded-r-lg ${getUpdateColor(update.type)}`}
                >
                  <div className="mt-0.5">{getUpdateIcon(update.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{update.message}</p>
                    <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Live updates will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test WebSocket */}
      <Card>
        <CardHeader>
          <CardTitle>Test Real-time Updates</CardTitle>
          <CardDescription>
            {connectionStatus === "error"
              ? "Simulate live events (Demo Mode)"
              : "Test WebSocket connection and simulate events"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const mockMessage = {
                  type: "NEW_REGISTRATION",
                  data: {
                    attendeeName: `Test User ${Math.floor(Math.random() * 1000)}`,
                    eventTitle: `Sample Event ${Math.floor(Math.random() * 100)}`,
                    ticketPrice: Math.floor(Math.random() * 100) + 20,
                  },
                  timestamp: new Date().toISOString(),
                }
                setLiveUpdates((prev) => [
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "registration",
                    message: formatMessage(mockMessage),
                    timestamp: mockMessage.timestamp,
                    data: mockMessage.data,
                  },
                  ...prev.slice(0, 9),
                ])
                updateLiveStats(mockMessage)
              }}
              size="sm"
            >
              Simulate Registration
            </Button>
            <Button
              onClick={() => {
                const mockMessage = {
                  type: "EVENT_CREATED",
                  data: {
                    title: `New Test Event ${Math.floor(Math.random() * 100)}`,
                    organizer: `Test Organizer ${Math.floor(Math.random() * 50)}`,
                  },
                  timestamp: new Date().toISOString(),
                }
                setLiveUpdates((prev) => [
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "event_created",
                    message: formatMessage(mockMessage),
                    timestamp: mockMessage.timestamp,
                    data: mockMessage.data,
                  },
                  ...prev.slice(0, 9),
                ])
                updateLiveStats(mockMessage)
              }}
              size="sm"
              variant="outline"
            >
              Simulate Event Creation
            </Button>
            <Button onClick={testWebSocket} size="sm" variant="secondary" disabled={!isConnected}>
              Test WebSocket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
