"use client"

import { useState } from "react"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star,
  Share2,
  Heart,
  ArrowLeft,
  User,
  Tag,
  Ticket,
  CheckCircle,
  AlertCircle,
  Download,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    bio: string
    email: string
    phone: string
    eventsOrganized: number
  }
  image: string
  tags: string[]
  popularity: number
  createdAt: string
  status: "published" | "draft"
  features: string[]
  schedule: Array<{
    time: string
    title: string
    speaker?: string
    description: string
  }>
  reviews: Array<{
    id: string
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
  }>
}

interface EventDetailProps {
  event: Event
  onBack: () => void
  onRegister: (eventId: number) => void
}

export default function EventDetail({ event, onBack, onRegister }: EventDetailProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  const handleRegister = async () => {
    setIsRegistering(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
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
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const spotsRemaining = event.maxAttendees - event.attendees
  const isFullyBooked = spotsRemaining <= 0
  const attendancePercentage = (event.attendees / event.maxAttendees) * 100

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Business":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "Health":
        return "bg-green-100 text-green-800 border-green-200"
      case "Arts":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "Music":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "Sports":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className={`${isFavorited ? "text-red-600 border-red-200 bg-red-50" : "text-gray-600"}`}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
            {isFavorited ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="text-gray-600 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[2.5/1] relative overflow-hidden rounded-xl">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
              {event.isFree ? (
                <Badge className="bg-emerald-500 text-white border-emerald-500">Free Event</Badge>
              ) : (
                <Badge className="bg-blue-600 text-white border-blue-600">${event.price}</Badge>
              )}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">{event.organizer.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {event.startTime} - {event.endTime}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location.city}, {event.location.country}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="about" className="data-[state=active]:bg-white">
                About
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-white">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-white">
                Location
              </TabsTrigger>
              <TabsTrigger value="organizer" className="data-[state=active]:bg-white">
                Organizer
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">About This Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>

                  {event.features && event.features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">What's Included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {event.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.tags.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Tag className="mr-2 h-4 w-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-gray-600 border-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">Duration</h4>
                      <p className="text-gray-600">
                        {event.startDate === event.endDate
                          ? "Single day event"
                          : `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">Category</h4>
                      <p className="text-gray-600">{event.category}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">Language</h4>
                      <p className="text-gray-600">English</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Event Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.schedule?.map((item, index) => (
                      <div key={index} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{item.time}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          {item.speaker && <p className="text-sm text-blue-600 mt-1">Speaker: {item.speaker}</p>}
                          <p className="text-gray-600 mt-2">{item.description}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Detailed schedule will be available soon</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <MapPin className="mr-2 h-5 w-5 text-red-500" />
                    Event Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{event.location.venue}</h4>
                    <p className="text-gray-600">
                      {event.location.address}
                      <br />
                      {event.location.city}, {event.location.country}
                    </p>
                  </div>

                  {/* Map Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Interactive map will be displayed here</p>
                      <p className="text-sm text-gray-500">Google Maps/OpenStreetMap integration</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Save Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <User className="mr-2 h-5 w-5 text-purple-500" />
                    Event Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                        {event.organizer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-gray-900">{event.organizer.name}</h3>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{event.organizer.rating} rating</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {event.organizer.eventsOrganized} events organized
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3">{event.organizer.bio}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center justify-center bg-transparent">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Organizer
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center bg-transparent">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Reviews & Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {event.reviews && event.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {event.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {review.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 mt-3">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No reviews yet</p>
                      <p className="text-sm">Be the first to review this event!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card className="sticky top-6 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <span>Registration</span>
                {event.isFree ? (
                  <Badge className="bg-emerald-500 text-white">Free</Badge>
                ) : (
                  <div className="text-2xl font-bold text-emerald-600">${event.price}</div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Registered</span>
                  <span className="font-semibold text-gray-900">
                    {event.attendees}/{event.maxAttendees}
                  </span>
                </div>
                <Progress value={attendancePercentage} className="h-3" />
                <div className="text-sm text-gray-600">
                  {isFullyBooked ? (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="font-medium">Event is fully booked</span>
                    </div>
                  ) : (
                    <span>{spotsRemaining} spots remaining</span>
                  )}
                </div>
              </div>

              {spotsRemaining <= 10 && spotsRemaining > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Only {spotsRemaining} spots left! Register soon to secure your place.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                onClick={handleRegister}
                disabled={isRegistering || isFullyBooked}
              >
                {isRegistering ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : isFullyBooked ? (
                  "Fully Booked"
                ) : event.isFree ? (
                  <>
                    <Ticket className="mr-2 h-5 w-5" />
                    Register for Free
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-5 w-5" />
                    Register for ${event.price}
                  </>
                )}
              </Button>

              {!isFullyBooked && (
                <p className="text-xs text-gray-500 text-center">
                  {event.isFree
                    ? "Free registration - no payment required"
                    : "Secure payment processing with instant confirmation"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">
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
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{event.location.venue}</div>
                  <div className="text-sm text-gray-600">
                    {event.location.city}, {event.location.country}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{event.attendees} registered</div>
                  <div className="text-sm text-gray-600">Max {event.maxAttendees} attendees</div>
                </div>
              </div>

              {!event.isFree && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">${event.price}</div>
                    <div className="text-sm text-gray-600">Per ticket</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organizer Quick Info */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {event.organizer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{event.organizer.name}</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    {event.organizer.rating} rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
