"use client"

import { useState, useMemo } from "react"
import { Calendar, MapPin, Users, Search, SlidersHorizontal, Star, Clock, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

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

interface FilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  dateRange: {
    start: string
    end: string
  }
  location: string
  isFree: boolean | null
  sortBy: "date" | "popularity" | "newest" | "price"
  sortOrder: "asc" | "desc"
}

export default function EventDiscovery({ onEventSelect }: { onEventSelect: (event: Event) => void }) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    priceRange: [0, 500],
    dateRange: { start: "", end: "" },
    location: "",
    isFree: null,
    sortBy: "date",
    sortOrder: "asc",
  })

  // Mock events data
  const allEvents: Event[] = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description:
        "Annual technology conference featuring the latest innovations in AI, blockchain, and web development. Join industry leaders and innovators for three days of learning and networking.",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      startTime: "09:00",
      endTime: "18:00",
      location: {
        venue: "San Francisco Convention Center",
        address: "747 Howard St",
        city: "San Francisco",
        country: "USA",
      },
      category: "Technology",
      attendees: 250,
      maxAttendees: 300,
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
      status: "published",
    },
    {
      id: 2,
      title: "Art & Design Workshop",
      description:
        "Creative workshop for artists and designers to explore new techniques and collaborate on innovative projects.",
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
      status: "published",
    },
    {
      id: 3,
      title: "Free Community Yoga Session",
      description: "Join us for a relaxing outdoor yoga session in the park. All levels welcome. Bring your own mat.",
      startDate: "2024-03-25",
      endDate: "2024-03-25",
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
      createdAt: "2024-02-10",
      status: "published",
    },
    {
      id: 4,
      title: "Business Networking Dinner",
      description: "Exclusive networking event for business professionals. Connect with industry leaders over dinner.",
      startDate: "2024-04-05",
      endDate: "2024-04-05",
      startTime: "19:00",
      endTime: "22:00",
      location: {
        venue: "Grand Hotel Chicago",
        address: "540 N Michigan Ave",
        city: "Chicago",
        country: "USA",
      },
      category: "Business",
      attendees: 85,
      maxAttendees: 100,
      price: 150,
      isFree: false,
      organizer: {
        name: "Business Network Pro",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.7,
      },
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Networking", "Business", "Professional"],
      popularity: 82,
      createdAt: "2024-02-20",
      status: "published",
    },
  ]

  const categories = ["Technology", "Arts", "Health", "Business", "Education", "Sports", "Music", "Food"]

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const filtered = allEvents.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.organizer.name.toLowerCase().includes(searchLower) ||
          event.location.city.toLowerCase().includes(searchLower) ||
          event.location.venue.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false
      }

      // Price filter
      if (filters.isFree !== null) {
        if (filters.isFree && !event.isFree) return false
        if (!filters.isFree && event.isFree) return false
      }

      if (!event.isFree && (event.price < filters.priceRange[0] || event.price > filters.priceRange[1])) {
        return false
      }

      // Date range filter
      if (filters.dateRange.start && event.startDate < filters.dateRange.start) return false
      if (filters.dateRange.end && event.startDate > filters.dateRange.end) return false

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        const matchesLocation =
          event.location.city.toLowerCase().includes(locationLower) ||
          event.location.country.toLowerCase().includes(locationLower)
        if (!matchesLocation) return false
      }

      return true
    })

    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case "popularity":
          comparison = b.popularity - a.popularity
          break
        case "newest":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case "price":
          comparison = a.price - b.price
          break
      }
      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }, [allEvents, filters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      priceRange: [0, 500],
      dateRange: { start: "", end: "" },
      location: "",
      isFree: null,
      sortBy: "date",
      sortOrder: "asc",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Discover Events</h2>
          <p className="text-gray-600 mt-1">Find and join amazing events in your area</p>
        </div>
        <div className="text-sm text-gray-500">{filteredEvents.length} events found</div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        {/* Search Bar */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events, organizers, or locations..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {(filters.categories.length > 0 || filters.isFree !== null || filters.location) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.categories.length + (filters.isFree !== null ? 1 : 0) + (filters.location ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={category} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value)}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="free-events"
                      checked={filters.isFree === true}
                      onCheckedChange={(checked) => updateFilter("isFree", checked ? true : null)}
                    />
                    <Label htmlFor="free-events" className="text-sm">
                      Free events only
                    </Label>
                  </div>
                </div>

                <Separator />

                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date" className="text-xs text-gray-500">
                        From
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, start: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-xs text-gray-500">
                        To
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City or country..."
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <Label className="text-sm font-medium">Sort by:</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
            {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        {/* Active Filters */}
        {(filters.categories.length > 0 || filters.isFree !== null || filters.location || filters.search) && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary">
                Search: {filters.search}
                <button
                  onClick={() => updateFilter("search", "")}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.isFree && (
              <Badge variant="secondary">
                Free events
                <button
                  onClick={() => updateFilter("isFree", null)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary">
                Location: {filters.location}
                <button
                  onClick={() => updateFilter("location", "")}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onEventSelect(event)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-blue-600">{event.category}</Badge>
              </div>
              <div className="absolute top-2 right-2">
                {event.isFree ? (
                  <Badge className="bg-green-600">Free</Badge>
                ) : (
                  <Badge className="bg-gray-900">${event.price}</Badge>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {event.organizer.rating}
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
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
                  <Users className="mr-2 h-4 w-4" />
                  {event.attendees}/{event.maxAttendees} registered
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">by {event.organizer.name}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {Math.round(((event.maxAttendees - event.attendees) / event.maxAttendees) * 100)}% available
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
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
          <Button onClick={clearFilters}>Clear all filters</Button>
        </div>
      )}
    </div>
  )
}
