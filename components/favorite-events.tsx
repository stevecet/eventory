"use client"

import { useState, useEffect } from "react"
import { Heart, Calendar, MapPin, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface FavoriteEventsProps {
  onEventSelect: (event: Event) => void
  allEvents: Event[]
}

export default function FavoriteEvents({ onEventSelect, allEvents }: FavoriteEventsProps) {
  const [favoritedEventIds, setFavoritedEventIds] = useState<number[]>([])

  useEffect(() => {
    // Simulate loading favorited event IDs from local storage or an API
    const storedFavorites = localStorage.getItem("favorited_events")
    if (storedFavorites) {
      setFavoritedEventIds(JSON.parse(storedFavorites))
    }
  }, [])

  const toggleFavorite = (eventId: number) => {
    setFavoritedEventIds((prev) => {
      const newFavorites = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
      localStorage.setItem("favorited_events", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const favoritedEvents = allEvents.filter((event) => favoritedEventIds.includes(event.id))

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Favorite Events</h2>
          <p className="text-gray-600 mt-1">Events you've marked as favorites</p>
        </div>
        <div className="text-sm text-gray-500">{favoritedEvents.length} favorited events</div>
      </div>

      {favoritedEvents.length === 0 ? (
        <Card className="py-12 text-center border-dashed border-gray-300 bg-gray-50">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite events yet</h3>
            <p className="text-gray-500 mb-4">Start exploring events and click the heart icon to add them here!</p>
            <Button onClick={() => (window.location.href = "#discover")}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group border-gray-200"
              onClick={() => onEventSelect(event)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  {event.isFree ? (
                    <Badge className="bg-emerald-500 text-white">Free</Badge>
                  ) : (
                    <Badge className="bg-blue-600 text-white">${event.price}</Badge>
                  )}
                </div>
                <button
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md text-red-500 hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent card click
                    toggleFavorite(event.id)
                  }}
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors text-gray-900">
                  {event.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-600">{event.description}</CardDescription>
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
                    <Users className="mr-2 h-4 w-4 text-purple-500" />
                    {event.attendees}/{event.maxAttendees} registered
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">by {event.organizer.name}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="mr-1 h-3 w-3 text-yellow-400 fill-current" />
                    {event.organizer.rating}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs text-gray-600 border-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
