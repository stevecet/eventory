"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, Users, MoreHorizontal, Download, Share2, X, Eye } from "lucide-react"
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
import TicketDownload from "./ticket-download" // Import the TicketDownload component

interface Event {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: {
    venue: string
    address: string
    city: string
    country: string
  }
  category: string
  attendees: number
  maxAttendees: number
  price: number
  isFree: boolean
  organizer: {
    name: string
    avatar: string
    rating: number
  }
  image: string
  tags: string[]
  popularity: number
  createdAt: string
  status: "published" | "draft"
}

// Expanded RegisteredEvent to include necessary data for TicketDownload
interface RegisteredEvent extends Event {
  registrationId: string
  registeredAt: string
  status: "upcoming" | "past" | "cancelled"
  canCancel: boolean
  ticketType: string // Added ticketType
  seatNumber?: string // Added seatNumber
  specialInstructions?: string // Added specialInstructions
}

interface MyEventsProps {
  allEvents: Event[] // Pass allEvents to retrieve full event details
  onEventSelect: (event: Event) => void // For viewing event details
}

export default function MyEvents({ allEvents, onEventSelect }: MyEventsProps) {
  const [cancellingEvent, setCancellingEvent] = useState<RegisteredEvent | null>(null)
  const [ticketToDownload, setTicketToDownload] = useState<RegisteredEvent | null>(null)

  // Mock data for registered events (expanded to match TicketData)
  const registeredEvents: RegisteredEvent[] = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring the latest innovations",
      startDate: "2024-04-15",
      endDate: "2024-04-17",
      startTime: "09:00",
      endTime: "18:00",
      location: {
        venue: "San Francisco Convention Center",
        address: "747 Howard St",
        city: "San Francisco",
        country: "USA",
      },
      category: "Technology",
      attendees: 342,
      maxAttendees: 500,
      price: 299,
      isFree: false,
      organizer: {
        name: "TechCorp Inc.",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
      },
      image: "/placeholder.svg?height=300&width=500",
      tags: ["AI", "Blockchain", "Networking"],
      popularity: 95,
      createdAt: "2024-01-15",
      status: "upcoming",
      registrationId: "REG-2024-001",
      registeredAt: "2024-02-15",
      canCancel: true,
      ticketType: "VIP",
      seatNumber: "A-15",
      specialInstructions: "Please bring your laptop for the workshop sessions.",
    },
    {
      id: 2,
      title: "Art & Design Workshop",
      description: "Creative workshop for artists and designers",
      startDate: "2024-03-20",
      endDate: "2024-03-20",
      startTime: "14:00",
      endTime: "17:00",
      location: {
        venue: "Creative Studio NYC",
        address: "123 Art Street",
        city: "New York",
        country: "USA",
      },
      category: "Arts",
      attendees: 45,
      maxAttendees: 50,
      price: 75,
      isFree: false,
      organizer: {
        name: "Creative Studio",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.6,
      },
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Design", "Creative", "Workshop"],
      popularity: 78,
      createdAt: "2024-02-01",
      status: "upcoming",
      registrationId: "REG-2024-002",
      registeredAt: "2024-02-20",
      canCancel: true,
      ticketType: "Regular",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      description: "Intensive coding bootcamp for beginners",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      startTime: "10:00",
      endTime: "16:00",
      location: {
        venue: "Online",
        address: "Virtual Platform",
        city: "Virtual",
        country: "Online",
      },
      category: "Education",
      attendees: 85,
      maxAttendees: 100,
      price: 199,
      isFree: false,
      organizer: {
        name: "Code Academy",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.7,
      },
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Coding", "Web Dev", "Bootcamp"],
      popularity: 90,
      createdAt: "2024-01-15",
      status: "past",
      registrationId: "REG-2024-003",
      registeredAt: "2024-01-15",
      canCancel: false,
      ticketType: "Standard",
    },
    {
      id: 4,
      title: "Community Yoga Session",
      description: "Free outdoor yoga session in the park",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      startTime: "08:00",
      endTime: "09:30",
      location: {
        venue: "Central Park",
        address: "Central Park West",
        city: "New York",
        country: "USA",
      },
      category: "Health",
      attendees: 120,
      maxAttendees: 150,
      price: 0,
      isFree: true,
      organizer: {
        name: "Wellness Community",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Yoga", "Wellness", "Outdoor"],
      popularity: 88,
      createdAt: "2024-02-05",
      status: "past",
      registrationId: "REG-2024-004",
      registeredAt: "2024-02-05",
      canCancel: false,
      ticketType: "Free",
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
    setTicketToDownload(event)
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
        return <Badge className="bg-emerald-600 text-white">Upcoming</Badge>
      case "past":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Arts":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "Education":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Health":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const EventCard = ({ event }: { event: RegisteredEvent }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 text-gray-900">{event.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-gray-600">{event.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEventSelect(event)}>
                <Eye className="mr-2 h-4 w-4" />
                View Event Details
              </DropdownMenuItem>
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
          <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-red-500" />
            {event.location.venue}, {event.location.city}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-emerald-500" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-purple-500" />
            Organized by {event.organizer.name}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Registration ID:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
              {event.registrationId}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Registered:</span>
            <span className="text-gray-800">{new Date(event.registeredAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Price:</span>
            <span className="font-semibold text-emerald-600">{event.isFree ? "Free" : `$${event.price}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (ticketToDownload) {
    const ticketData = {
      id: ticketToDownload.registrationId,
      eventTitle: ticketToDownload.title,
      eventDate: new Date(ticketToDownload.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      eventTime: `${ticketToDownload.startTime} - ${ticketToDownload.endTime}`,
      venue: ticketToDownload.location.venue,
      address: `${ticketToDownload.location.address}, ${ticketToDownload.location.city}, ${ticketToDownload.location.country}`,
      attendeeName: "Current User", // Replace with actual user name
      attendeeEmail: "current.user@example.com", // Replace with actual user email
      ticketType: ticketToDownload.ticketType,
      price: ticketToDownload.price,
      qrCode: `QR-${ticketToDownload.registrationId}`,
      registrationDate: new Date(ticketToDownload.registeredAt).toLocaleDateString(),
      seatNumber: ticketToDownload.seatNumber,
      specialInstructions: ticketToDownload.specialInstructions,
    }
    return <TicketDownload ticketData={ticketData} onClose={() => setTicketToDownload(null)} />
  }

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
        <TabsList className="bg-gray-100">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-white">
            Past Events ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center border-dashed border-gray-300 bg-gray-50">
              <CardContent>
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-500 mb-4">You haven't registered for any upcoming events yet.</p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => (window.location.href = "#discover")}>
                  Browse Events
                </Button>
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
            <Card className="py-12 text-center border-dashed border-gray-300 bg-gray-50">
              <CardContent>
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
              Are you sure you want to cancel your registration for "
              <span className="font-semibold text-gray-900">{cancellingEvent?.title}</span>"?
              {!cancellingEvent?.isFree && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 text-sm">
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
