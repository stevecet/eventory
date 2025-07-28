"use client"

import { useState } from "react"
import { Calendar, Users, Edit, Trash2, Eye, MoreHorizontal, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AttendeeManagement from "./attendee-management"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  attendees: number
  maxAttendees: number
  price: number
  status: "draft" | "published" | "cancelled"
  registrations: Array<{
    id: number
    name: string
    email: string
    registeredAt: string
    checkedIn: boolean
  }>
}

export default function EventManagement() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showAttendeeManagement, setShowAttendeeManagement] = useState<Event | null>(null)

  // Mock data for organizer's events
  const events: Event[] = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      description: "Intensive coding bootcamp for beginners",
      date: "2024-04-01",
      time: "10:00 AM",
      location: "Online",
      category: "Education",
      attendees: 85,
      maxAttendees: 100,
      price: 199,
      status: "published",
      registrations: [
        { id: 1, name: "John Doe", email: "john@example.com", registeredAt: "2024-03-15", checkedIn: false },
        { id: 2, name: "Jane Smith", email: "jane@example.com", registeredAt: "2024-03-16", checkedIn: true },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", registeredAt: "2024-03-17", checkedIn: false },
      ],
    },
    {
      id: 2,
      title: "Digital Marketing Workshop",
      description: "Learn the latest digital marketing strategies",
      date: "2024-04-15",
      time: "02:00 PM",
      location: "New York, NY",
      category: "Business",
      attendees: 45,
      maxAttendees: 60,
      price: 89,
      status: "published",
      registrations: [
        { id: 4, name: "Sarah Wilson", email: "sarah@example.com", registeredAt: "2024-03-18", checkedIn: false },
        { id: 5, name: "Tom Brown", email: "tom@example.com", registeredAt: "2024-03-19", checkedIn: false },
      ],
    },
    {
      id: 3,
      title: "AI Conference 2024",
      description: "Exploring the future of artificial intelligence",
      date: "2024-05-01",
      time: "09:00 AM",
      location: "San Francisco, CA",
      category: "Technology",
      attendees: 0,
      maxAttendees: 200,
      price: 299,
      status: "draft",
      registrations: [],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEventAction = (action: string, eventId: number) => {
    console.log(`${action} event ${eventId}`)
    // Implement actions like edit, delete, duplicate, etc.
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600 mt-1">Manage your created events and attendees</p>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">All Events ({events.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <DropdownMenuItem onClick={() => handleEventAction("edit", event.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEventAction("view", event.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowAttendeeManagement(event)}>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Attendees
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEventAction("delete", event.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {event.attendees}/{event.maxAttendees} registered
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />${event.price}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((event.attendees / event.maxAttendees) * 100)}% capacity
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">
                  {events.filter((e) => e.status === "published").length} published
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.reduce((sum, event) => sum + event.attendees, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${events.reduce((sum, event) => sum + event.attendees * event.price, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From ticket sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (events.reduce((sum, event) => sum + event.attendees / event.maxAttendees, 0) / events.length) *
                      100,
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Capacity utilization</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Attendee Management Modal/Panel */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendee Management</CardTitle>
                  <CardDescription>{selectedEvent.title}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Registered Attendees ({selectedEvent.registrations.length})</h3>
                  <Button size="sm">Export List</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEvent.registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${registration.name}`} />
                            <AvatarFallback>
                              {registration.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{registration.name}</span>
                        </TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.registeredAt}</TableCell>
                        <TableCell>
                          <Badge variant={registration.checkedIn ? "default" : "secondary"}>
                            {registration.checkedIn ? "Checked In" : "Registered"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            {registration.checkedIn ? "Check Out" : "Check In"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showAttendeeManagement && (
        <AttendeeManagement event={showAttendeeManagement} onBack={() => setShowAttendeeManagement(null)} />
      )}
    </div>
  )
}
