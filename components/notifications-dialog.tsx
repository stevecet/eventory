"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, CheckCircle, Info, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsDialog({ isOpen, onClose }: NotificationsDialogProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Registration Confirmed!",
      message: "You are successfully registered for Tech Conference 2024.",
      timestamp: "2024-04-10T10:00:00Z",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Event Reminder",
      message: "Digital Marketing Masterclass is tomorrow at 2 PM.",
      timestamp: "2024-05-19T09:00:00Z",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Low Spots Remaining",
      message: "Only 5 spots left for the AI Innovation Summit!",
      timestamp: "2024-06-01T15:30:00Z",
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "Payment Failed",
      message: "Your payment for 'Startup Pitch Night' could not be processed.",
      timestamp: "2024-03-20T11:45:00Z",
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "New Event Published",
      message: "Your event 'Future of Web3' has been published.",
      timestamp: "2024-06-15T08:00:00Z",
      read: false,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "warning":
        return <Info className="h-5 w-5 text-amber-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getBadgeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-emerald-100 text-emerald-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "error":
        return "bg-red-100 text-red-800"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-2 h-6 w-6 text-gray-700" />
              Notifications
              {unreadCount > 0 && <Badge className="ml-2 bg-blue-600 text-white">{unreadCount}</Badge>}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark All Read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                Clear All
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No new notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  notif.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-100 shadow-sm"
                }`}
              >
                <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                    <Badge className={getBadgeColor(notif.type)}>{notif.type}</Badge>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{notif.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</span>
                    {!notif.read && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => markAsRead(notif.id)}
                        className="h-auto p-0 text-blue-600"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
