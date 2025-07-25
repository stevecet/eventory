"use client"

import { Calendar, Plus, ExternalLink } from "lucide-react"
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
  organizer: string
}

interface CalendarIntegrationProps {
  event: Event
}

export default function CalendarIntegration({ event }: CalendarIntegrationProps) {
  const formatDateForCalendar = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`)
    return dateTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const generateCalendarUrls = () => {
    const startDateTime = formatDateForCalendar(event.startDate, event.startTime)
    const endDateTime = formatDateForCalendar(event.endDate, event.endTime)
    const location = `${event.location.venue}, ${event.location.address}, ${event.location.city}, ${event.location.country}`

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title,
      )}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(
        event.description,
      )}&location=${encodeURIComponent(location)}&sf=true&output=xml`,

      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
        event.title,
      )}&startdt=${startDateTime}&enddt=${endDateTime}&body=${encodeURIComponent(
        event.description,
      )}&location=${encodeURIComponent(location)}`,

      yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(
        event.title,
      )}&st=${startDateTime}&et=${endDateTime}&desc=${encodeURIComponent(
        event.description,
      )}&in_loc=${encodeURIComponent(location)}`,

      ics: generateICSFile(),
    }
  }

  const generateICSFile = () => {
    const startDateTime = formatDateForCalendar(event.startDate, event.startTime)
    const endDateTime = formatDateForCalendar(event.endDate, event.endTime)
    const location = `${event.location.venue}, ${event.location.address}, ${event.location.city}, ${event.location.country}`

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventHub//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@eventhub.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\n\\nOrganized by: ${event.organizer}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`

    return icsContent
  }

  const handleCalendarAdd = (provider: string) => {
    const urls = generateCalendarUrls()

    switch (provider) {
      case "google":
        window.open(urls.google, "_blank")
        break
      case "outlook":
        window.open(urls.outlook, "_blank")
        break
      case "yahoo":
        window.open(urls.yahoo, "_blank")
        break
      case "ics":
        downloadICSFile()
        break
      case "apple":
        downloadICSFile() // Apple Calendar uses ICS files
        break
    }
  }

  const downloadICSFile = () => {
    const icsContent = generateICSFile()
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const calendarProviders = [
    {
      name: "Google Calendar",
      id: "google",
      icon: "🗓️",
      description: "Add to your Google Calendar",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Outlook",
      id: "outlook",
      icon: "📅",
      description: "Add to Microsoft Outlook",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Apple Calendar",
      id: "apple",
      icon: "🍎",
      description: "Download for Apple Calendar",
      color: "bg-gray-800 hover:bg-gray-900",
    },
    {
      name: "Yahoo Calendar",
      id: "yahoo",
      icon: "🟣",
      description: "Add to Yahoo Calendar",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      name: "Download ICS",
      id: "ics",
      icon: "📥",
      description: "Download calendar file",
      color: "bg-green-600 hover:bg-green-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Add to Calendar
        </CardTitle>
        <CardDescription>Never miss this event - add it to your calendar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">{event.title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(event.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="ml-6">
              {event.startTime} - {event.endTime}
            </div>
            <div className="ml-6">
              {event.location.venue}, {event.location.city}
            </div>
          </div>
        </div>

        {/* Calendar Provider Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {calendarProviders.map((provider) => (
            <Button
              key={provider.id}
              onClick={() => handleCalendarAdd(provider.id)}
              className={`${provider.color} text-white justify-start h-auto p-4`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{provider.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs opacity-90">{provider.description}</div>
                </div>
              </div>
              <ExternalLink className="ml-auto h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Quick Add Button */}
        <div className="pt-4 border-t">
          <Button onClick={() => handleCalendarAdd("google")} className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Quick Add to Google Calendar
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <h4 className="font-medium">How it works:</h4>
          <ul className="space-y-1 ml-4">
            <li>• Click your preferred calendar provider above</li>
            <li>• You'll be redirected to add the event</li>
            <li>• The event details will be pre-filled</li>
            <li>• You can modify details before saving</li>
          </ul>
        </div>

        {/* Reminder Options */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📱 Set Reminders:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              1 day before
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              1 hour before
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              15 minutes before
            </Badge>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Most calendar apps will let you set custom reminders after adding the event.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
