"use client"

import { useState } from "react"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  MapPin,
  UserCheck,
  Ticket,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import TicketDownload from "./ticket-download" // Import TicketDownload

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

interface OrganizerDashboardProps {
  allEvents: Event[] // Pass allEvents to retrieve full event details
  onEventSelect: (event: Event) => void // For viewing event details
  onCreateEvent: () => void // For creating new event
}

export default function OrganizerDashboard({ allEvents, onEventSelect, onCreateEvent }: OrganizerDashboardProps) {
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<Event | null>(null)
  const [locale, setLocale] = useState("en") // State for language

  // Filter events that belong to the current organizer (mocking for now)
  const organizerEvents = allEvents.filter(
    (event) =>
      event.organizer.name === "TechCorp Inc." ||
      event.organizer.name === "Marketing Pro Academy" ||
      event.organizer.name === "Code Academy" ||
      event.organizer.name === "Wellness Community",
  )

  const totalRevenue = organizerEvents.reduce((sum, event) => sum + event.price * event.attendees, 0)
  const totalRegistrations = organizerEvents.reduce((sum, event) => sum + event.attendees, 0)
  const totalCapacity = organizerEvents.reduce((sum, event) => sum + event.maxAttendees, 0)
  const averageAttendance = organizerEvents.length > 0 ? totalRegistrations / organizerEvents.length : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadAttendeeList = (event: Event) => {
    console.log(`Downloading attendee list for event: ${event.title}`)
    // Simulate CSV download
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Attendee Name,Attendee Email,Registered At,Checked In\n" +
      event.attendees +
      " attendees data here..." // Placeholder for actual data
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${event.title.replace(/\s/g, "_")}_attendees.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditEvent = (event: Event) => {
    console.log(`Editing event: ${event.title}`)
    // In a real app, this would navigate to an event editing form
    // For now, we'll just log it.
    // onCreateEvent() // Could potentially reuse create event form
  }

  const handleViewTicket = (event: Event) => {
    // Mock ticket data for viewing
    const mockTicketData = {
      id: `TKT-${event.id}-${Math.random().toString(36).substr(2, 5)}`,
      eventTitle: event.title,
      eventDate: new Date(event.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      eventTime: `${event.startTime} - ${event.endTime}`,
      venue: event.location.venue,
      address: `${event.location.address}, ${event.location.city}, ${event.location.country}`,
      attendeeName: "Sample Attendee", // This would be dynamic in a real app
      attendeeEmail: "sample@example.com", // This would be dynamic in a real app
      ticketType: "Regular", // This would be dynamic
      price: event.price,
      qrCode: `QR-${event.id}`,
      registrationDate: new Date().toLocaleDateString(),
      seatNumber: "N/A",
      specialInstructions: "Organizer view: This is a sample ticket for demonstration.",
    }
    setSelectedEventForTicket(mockTicketData as any) // Cast to any for now, as Event and TicketData are slightly different
  }

  if (selectedEventForTicket) {
    return <TicketDownload ticketData={selectedEventForTicket as any} onClose={() => setSelectedEventForTicket(null)} />
  }

  const translations = {
    en: {
      dashboardTitle: "Organizer Dashboard",
      dashboardSubtitle: "Manage your events and track performance",
      createNewEvent: "Create New Event",
      totalEvents: "Total Events",
      totalRevenue: "Total Revenue",
      totalRegistrations: "Total Registrations",
      avgAttendance: "Avg. Attendance",
      myEvents: "My Events",
      analytics: "Analytics",
      attendees: "Attendees",
      capacity: "Capacity",
      checkInRate: "Check-in Rate",
      view: "View",
      edit: "Edit",
      downloadAttendees: "Download Attendees",
      viewTicket: "View Ticket",
      registrationTrends: "Registration Trends",
      revenueByCategory: "Revenue by Category",
      eventPerformance: "Event Performance",
      recentRegistrations: "Recent Registrations",
      registered: "Registered",
      checkedIn: "Checked In",
      status: "Status",
      event: "Event",
      registrations: "Registrations",
      revenue: "Revenue",
      attendee: "Attendee",
      email: "Email",
      registeredAt: "Registered At",
      actions: "Actions",
      published: "Published",
      draft: "Draft",
      cancelled: "Cancelled",
      completed: "Completed",
      fromLastMonth: "from last month",
      acrossAllEvents: "Across all events",
      fromTicketSales: "From ticket sales",
      capacityUtilization: "Capacity utilization",
      chartVisualization: "Chart visualization would be here",
      integrationWith: "Integration with Chart.js or Recharts",
      pieChart: "Pie chart would be here",
      revenueDistribution: "Revenue distribution visualization",
      detailedPerformance: "Detailed performance metrics for each event",
      latestRegistrations: "Latest attendee registrations across all events",
      sampleTicket: "Sample Ticket",
    },
    fr: {
      dashboardTitle: "Tableau de bord de l'organisateur",
      dashboardSubtitle: "Gérez vos événements et suivez les performances",
      createNewEvent: "Créer un nouvel événement",
      totalEvents: "Total des événements",
      totalRevenue: "Revenu total",
      totalRegistrations: "Total des inscriptions",
      avgAttendance: "Part. moyenne",
      myEvents: "Mes événements",
      analytics: "Analytique",
      attendees: "Participants",
      capacity: "Capacité",
      checkInRate: "Taux d'enregistrement",
      view: "Voir",
      edit: "Modifier",
      downloadAttendees: "Télécharger les participants",
      viewTicket: "Voir le billet",
      registrationTrends: "Tendances d'inscription",
      revenueByCategory: "Revenus par catégorie",
      eventPerformance: "Performance de l'événement",
      recentRegistrations: "Inscriptions récentes",
      registered: "Inscrit",
      checkedIn: "Enregistré",
      status: "Statut",
      event: "Événement",
      registrations: "Inscriptions",
      revenue: "Revenu",
      attendee: "Participant",
      email: "E-mail",
      registeredAt: "Inscrit le",
      actions: "Actions",
      published: "Publié",
      draft: "Brouillon",
      cancelled: "Annulé",
      completed: "Terminé",
      fromLastMonth: "par rapport au mois dernier",
      acrossAllEvents: "Sur tous les événements",
      fromTicketSales: "Des ventes de billets",
      capacityUtilization: "Utilisation de la capacité",
      chartVisualization: "La visualisation du graphique serait ici",
      integrationWith: "Intégration avec Chart.js ou Recharts",
      pieChart: "Le graphique circulaire serait ici",
      revenueDistribution: "Visualisation de la répartition des revenus",
      detailedPerformance: "Mesures de performance détaillées pour chaque événement",
      latestRegistrations: "Dernières inscriptions de participants pour tous les événements",
      sampleTicket: "Billet d'exemple",
    },
  }

  const t = translations[locale as keyof typeof translations]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t.dashboardTitle}</h2>
          <p className="text-gray-600 mt-1">{t.dashboardSubtitle}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreateEvent}>
          <Calendar className="mr-2 h-4 w-4" />
          {t.createNewEvent}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.totalEvents}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{organizerEvents.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+2</span> {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+15%</span> {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.totalRegistrations}</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalRegistrations}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+8%</span> {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t.avgAttendance}</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(averageAttendance)}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+12%</span> {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="events" className="data-[state=active]:bg-white">
            {t.myEvents}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            {t.analytics}
          </TabsTrigger>
          <TabsTrigger value="attendees" className="data-[state=active]:bg-white">
            {t.attendees}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.map((event) => {
              const attendanceRate = (event.attendees / event.maxAttendees) * 100
              const checkInRate = event.attendees > 0 ? (event.checkedIn / event.attendees) * 100 : 0

              return (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-200 border-gray-200"
                >
                  <div className="aspect-video relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(event.status)}>{t[event.status as keyof typeof t]}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 text-gray-900">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">{event.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                        {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 text-red-500" />
                        {event.location.city}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="mr-2 h-4 w-4 text-purple-500" />
                        {event.attendees}/{event.maxAttendees} {t.registered}
                      </div>
                      {event.price > 0 && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="mr-2 h-4 w-4 text-emerald-500" />$
                          {(event.price * event.attendees).toLocaleString()} {t.revenue}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.capacity}</span>
                        <span className="font-medium text-gray-900">{attendanceRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={attendanceRate} className="h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
                    </div>

                    {event.status === "completed" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t.checkInRate}</span>
                          <span className="font-medium text-gray-900">{checkInRate.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={checkInRate}
                          className="h-2 bg-emerald-200"
                          indicatorClassName="bg-emerald-600"
                        />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => onEventSelect(event)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t.view}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadAttendeeList(event)}>
                            <Download className="mr-2 h-4 w-4" />
                            {t.downloadAttendees}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewTicket(event)}>
                            <Ticket className="mr-2 h-4 w-4" />
                            {t.viewTicket}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                  {t.registrationTrends}
                </CardTitle>
                <CardDescription>{t.registrationTrends}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-600">{t.chartVisualization}</p>
                    <p className="text-sm text-gray-500">{t.integrationWith}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <PieChart className="mr-2 h-5 w-5 text-emerald-500" />
                  {t.revenueByCategory}
                </CardTitle>
                <CardDescription>{t.revenueByCategory}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg border border-emerald-200">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                    <p className="text-gray-600">{t.pieChart}</p>
                    <p className="text-sm text-gray-500">{t.revenueDistribution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Activity className="mr-2 h-5 w-5 text-purple-500" />
                {t.eventPerformance}
              </CardTitle>
              <CardDescription>{t.detailedPerformance}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.event}</TableHead>
                    <TableHead>{t.registrations}</TableHead>
                    <TableHead>{t.capacity}</TableHead>
                    <TableHead>{t.revenue}</TableHead>
                    <TableHead>{t.status}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizerEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium text-gray-900">{event.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-800">{event.attendees}</span>
                          <Progress
                            value={(event.attendees / event.maxAttendees) * 100}
                            className="w-16 h-2 bg-blue-200"
                            indicatorClassName="bg-blue-600"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800">{event.maxAttendees}</TableCell>
                      <TableCell className="text-emerald-600 font-medium">
                        ${(event.price * event.attendees).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>{t[event.status as keyof typeof t]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
                {t.recentRegistrations}
              </CardTitle>
              <CardDescription>{t.latestRegistrations}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizerEvents.flatMap((event) =>
                  event.registrations?.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${registration.name.charAt(0)}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {registration.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{registration.name}</p>
                        <p className="text-sm text-gray-600">{registration.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(registration.registeredAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        {registration.checkedIn ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            <UserCheck className="mr-1 h-3 w-3" />
                            {t.checkedIn}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            <Clock className="mr-1 h-3 w-3" />
                            {t.registered}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
