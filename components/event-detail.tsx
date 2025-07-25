"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, DollarSign, Star, Share2, Heart, ArrowLeft, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface EventDetailProps {
  event: Event
  onBack: () => void
  onRegister: (eventId: number) => void
}

export default function EventDetail({ event, onBack, onRegister }: EventDetailProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleRegister = async () => {
    setIsRegistering(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onRegister(event.id)
    setIsRegistering(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const spotsRemaining = event.maxAttendees - event.attendees
  const isFullyBooked = spotsRemaining <= 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className={isFavorited ? "text-red-600" : ""}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
            {isFavorited ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[2/1] relative overflow-hidden rounded-lg">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-600">{event.category}</Badge>
              {event.isFree ? (
                <Badge className="bg-green-600">Free Event</Badge>
              ) : (
                <Badge className="bg-gray-900">${event.price}</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {event.startTime} - {event.endTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="organizer">Organizer</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>

                  {event.tags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Tag className="mr-2 h-4 w-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Event Duration</h4>
                      <p className="text-gray-600">
                        {event.startDate === event.endDate
                          ? "Single day event"
                          : `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                      <p className="text-gray-600">{event.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Event Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{event.location.venue}</h4>
                    <p className="text-gray-600">
                      {event.location.address}
                      <br />
                      {event.location.city}, {event.location.country}
                    </p>
                  </div>

                  {/* Map Placeholder */}
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive map will be displayed here</p>
                      <p className="text-sm text-gray-400">Google Maps/OpenStreetMap integration</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Event Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                      <AvatarFallback>
                        {event.organizer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.organizer.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{event.organizer.rating} rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Organizer Profile
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Organizer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Registration</span>
                {event.isFree ? (
                  <Badge className="bg-green-600">Free</Badge>
                ) : (
                  <div className="text-2xl font-bold text-green-600">${event.price}</div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Registered</span>
                  <span className="font-medium">
                    {event.attendees}/{event.maxAttendees}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {isFullyBooked ? (
                    <span className="text-red-600 font-medium">Event is fully booked</span>
                  ) : (
                    <span>{spotsRemaining} spots remaining</span>
                  )}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleRegister} disabled={isRegistering || isFullyBooked}>
                {isRegistering
                  ? "Registering..."
                  : isFullyBooked
                    ? "Fully Booked"
                    : event.isFree
                      ? "Register for Free"
                      : `Register for $${event.price}`}
              </Button>

              {!isFullyBooked && (
                <p className="text-xs text-gray-500 text-center">
                  {event.isFree ? "Free registration - no payment required" : "Secure payment processing"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">{event.location.venue}</div>
                  <div className="text-sm text-gray-600">
                    {event.location.city}, {event.location.country}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">{event.attendees} registered</div>
                  <div className="text-sm text-gray-600">Max {event.maxAttendees} attendees</div>
                </div>
              </div>

              {!event.isFree && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">${event.price}</div>
                    <div className="text-sm text-gray-600">Per ticket</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
