"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, Users, MoreHorizontal, Download, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RegisteredEvent {
  id: number
  title: string
  description: string
  startDate: string
  startTime: string
  endTime: string
  location: {
    venue: string
    city: string
    country: string
  }
  category: string
  price: number
  isFree: boolean
  registrationId: string
  registeredAt: string
  status: "upcoming" | "past" | "cancelled"
  canCancel: boolean
  organizer: string
}

export default function MyEvents() {
  const [cancellingEvent, setCancellingEvent] = useState<RegisteredEvent | null>(null)

  // Mock data for registered events
  const registeredEvents: RegisteredEvent[] = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring the latest innovations",
      startDate: "2024-03-15",
      startTime: "09:00",
      endTime: "18:00",
      location: {
        venue: "San Francisco Convention Center",
        city: "San Francisco",
        country: "USA",
      },
      category: "Technology",
      price: 299,
      isFree: false,
      registrationId: "REG-2024-001",
      registeredAt: "2024-02-15",
      status: "upcoming",
      canCancel: true,
      organizer: "TechCorp Inc.",
    },
    {
      id: 2,
      title: "Art & Design Workshop",
      description: "Creative workshop for artists and designers",
      startDate: "2024-03-20",
      startTime: "14:00",
      endTime: "17:00",
      location: {
        venue: "Creative Studio NYC",
        city: "New York",
        country: "USA",
      },
      category: "Arts",
      price: 75,
      isFree: false,
      registrationId: "REG-2024-002",
      registeredAt: "2024-02-20",
      status: "upcoming",
      canCancel: true,
      organizer: "Creative Studio",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      description: "Intensive coding bootcamp for beginners",
      startDate: "2024-02-01",
      startTime: "10:00",
      endTime: "16:00",
      location: {
        venue: "Online",
        city: "Virtual",
        country: "Online",
      },
      category: "Education",
      price: 199,
      isFree: false,
      registrationId: "REG-2024-003",
      registeredAt: "2024-01-15",
      status: "past",
      canCancel: false,
      organizer: "Code Academy",
    },
    {
      id: 4,
      title: "Community Yoga Session",
      description: "Free outdoor yoga session in the park",
      startDate: "2024-02-10",
      startTime: "08:00",
      endTime: "09:30",
      location: {
        venue: "Central Park",
        city: "New York",
        country: "USA",
      },
      category: "Health",
      price: 0,
      isFree: true,
      registrationId: "REG-2024-004",
      registeredAt: "2024-02-05",
      status: "past",
      canCancel: false,
      organizer: "Wellness Community",
    },
  ]

  const upcomingEvents = registeredEvents.filter((event) => event.status === "upcoming")
  const pastEvents = registeredEvents.filter((event) => event.status === "past")

  const handleCancelRegistration = (event: RegisteredEvent) => {
    setCancellingEvent(event)
  }

  const confirmCancellation = () => {
    if (cancellingEvent) {
      console.log("Cancelling registration for event:", cancellingEvent.id)
      // Here you would typically send a cancellation request to your backend
      setCancellingEvent(null)
      // Show success message or update the events list
    }
  }

  const handleDownloadTicket = (event: RegisteredEvent) => {
    console.log("Downloading ticket for event:", event.id)
    // Generate and download ticket
  }

  const handleShareEvent = (event: RegisteredEvent) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join me at ${event.title}`,
        url: `${window.location.origin}/events/${event.id}`,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-600">Upcoming</Badge>
      case "past":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const EventCard = ({ event }: { event: RegisteredEvent }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{event.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadTicket(event)}>
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareEvent(event)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </DropdownMenuItem>
              {event.canCancel && (
                <DropdownMenuItem onClick={() => handleCancelRegistration(event)} className="text-red-600">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Registration
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between mt-2">
          {getStatusBadge(event.status)}
          <Badge variant="outline">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location.venue}, {event.location.city}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Organized by {event.organizer}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Registration ID:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{event.registrationId}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Registered:</span>
            <span>{new Date(event.registeredAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Price:</span>
            <span className="font-semibold text-green-600">{event.isFree ? "Free" : `$${event.price}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600 mt-1">Manage your event registrations</p>
        </div>
        <div className="text-sm text-gray-500">
          {registeredEvents.length} total registration{registeredEvents.length !== 1 ? "s" : ""}
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-500 mb-4">You haven't registered for any upcoming events yet.</p>
                <Button>Browse Events</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                <p className="text-gray-500">Your completed events will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={!!cancellingEvent} onOpenChange={() => setCancellingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for "{cancellingEvent?.title}"?
              {!cancellingEvent?.isFree && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Refund Policy:</strong> Cancellations made more than 48 hours before the event will receive
                    a full refund. Cancellations within 48 hours may be subject to processing fees.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Registration</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancellation} className="bg-red-600 hover:bg-red-700">
              Cancel Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
