"use client"

import type React from "react"

import { CheckCircle, Calendar, MapPin, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Event {
  id: number
  title: string
  startDate: string
  startTime: string
  endTime: string
  location: {
    venue: string
    address: string
    city: string
    country: string
  }
  price: number
  isFree: boolean
}

interface RegistrationConfirmationProps {
  event: Event
  registrationId: string
  userEmail: string
  onContinue: () => void
}

export default function RegistrationConfirmation({
  event,
  registrationId,
  userEmail,
  onContinue,
}: RegistrationConfirmationProps) {
  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    console.log("Downloading ticket for registration:", registrationId)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I'm attending ${event.title}`,
        text: `Join me at ${event.title} on ${new Date(event.startDate).toLocaleDateString()}`,
        url: window.location.href,
      })
    }
  }

  const handleAddToCalendar = () => {
    // Generate calendar event
    const startDateTime = new Date(`${event.startDate}T${event.startTime}`)
    const endDateTime = new Date(`${event.startDate}T${event.endTime}`)

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title,
    )}&dates=${startDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${
      endDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]
    }Z&location=${encodeURIComponent(`${event.location.venue}, ${event.location.address}, ${event.location.city}`)}`

    window.open(calendarUrl, "_blank")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Successful!</h1>
          <p className="text-gray-600 mt-2">You're all set for this amazing event</p>
        </div>
      </div>

      {/* Registration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Confirmation</CardTitle>
          <CardDescription>Keep this information for your records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Registration ID</Label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{registrationId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Registered Email</Label>
              <p className="text-sm">{userEmail}</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                {event.isFree ? "Registration confirmed" : "Payment processed successfully"}
              </span>
            </div>
            <p className="text-green-700 text-sm mt-1">A confirmation email has been sent to {userEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="flex items-center space-x-2 mb-2">
              {event.isFree ? (
                <Badge className="bg-green-600">Free Event</Badge>
              ) : (
                <Badge className="bg-blue-600">Paid Event - ${event.price}</Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
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
                  {event.location.address}
                  <br />
                  {event.location.city}, {event.location.country}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={handleDownloadTicket}
              className="flex flex-col items-center p-4 h-auto bg-transparent"
            >
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Download Ticket</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleAddToCalendar}
              className="flex flex-col items-center p-4 h-auto bg-transparent"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Add to Calendar</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex flex-col items-center p-4 h-auto bg-transparent"
            >
              <Share2 className="h-6 w-6 mb-2" />
              <span className="text-sm">Share Event</span>
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Reminders:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email for detailed event information</li>
              <li>• Arrive 15 minutes early for check-in</li>
              <li>• Bring a valid ID for verification</li>
              <li>• Contact the organizer if you have any questions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" onClick={onContinue} className="flex-1 bg-transparent">
          Browse More Events
        </Button>
        <Button onClick={onContinue} className="flex-1">
          View My Events
        </Button>
      </div>
    </div>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
