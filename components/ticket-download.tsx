"use client"

import { useState } from "react"
import {
  Download,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  Ticket,
  CheckCircle,
  Share2,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TicketData {
  id: string
  eventTitle: string
  eventDate: string
  eventTime: string
  venue: string
  address: string
  attendeeName: string
  attendeeEmail: string
  ticketType: string
  price: number
  qrCode: string
  registrationDate: string
  seatNumber?: string
  specialInstructions?: string
}

interface TicketDownloadProps {
  ticketData: TicketData
  onClose: () => void
}

export default function TicketDownload({ ticketData, onClose }: TicketDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would generate and download a PDF
    const element = document.createElement("a")
    element.href =
      "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEV2ZW50IFRpY2tldCkKL0NyZWF0b3IgKEV2ZW50SHViKQovUHJvZHVjZXIgKEV2ZW50SHViKQovQ3JlYXRpb25EYXRlIChEOjIwMjQwMTIwMTAwMDAwWikKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTU4IDAwMDAwIG4gCjAwMDAwMDAyMDggMDAwMDAgbiAKMDAwMDAwMDI2MyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjM2NAolJUVPRgo="
    element.download = `ticket-${ticketData.id}.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setIsDownloading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${ticketData.eventTitle}`,
        text: `I'm attending ${ticketData.eventTitle} on ${ticketData.eventDate}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Ready!</h1>
          <p className="text-gray-600 mt-2">Your event ticket has been generated successfully</p>
        </div>
      </div>

      {/* Ticket Preview */}
      <Card className="overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{ticketData.eventTitle}</CardTitle>
              <p className="text-blue-100 mt-1">Event Ticket</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white text-blue-600 font-semibold">{ticketData.ticketType}</Badge>
              <p className="text-blue-100 text-sm mt-1">#{ticketData.id}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Date</p>
                  <p className="text-gray-600">{ticketData.eventDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-gray-900">Time</p>
                  <p className="text-gray-600">{ticketData.eventTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Venue</p>
                  <p className="text-gray-600">{ticketData.venue}</p>
                  <p className="text-sm text-gray-500">{ticketData.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Attendee</p>
                  <p className="text-gray-600">{ticketData.attendeeName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">{ticketData.attendeeEmail}</p>
                </div>
              </div>

              {ticketData.seatNumber && (
                <div className="flex items-center space-x-3">
                  <Ticket className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Seat</p>
                    <p className="text-gray-600">{ticketData.seatNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* QR Code Section */}
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-3">
                <QrCode className="h-20 w-20 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Scan for check-in</p>
            </div>

            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-gray-900">Important Information:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Please arrive 15 minutes before the event starts</li>
                <li>• Bring a valid ID for verification</li>
                <li>• This ticket is non-transferable</li>
                <li>• Present this QR code at the entrance</li>
              </ul>
            </div>
          </div>

          {ticketData.specialInstructions && (
            <>
              <Separator />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Special Instructions:</h4>
                <p className="text-amber-700 text-sm">{ticketData.specialInstructions}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Ticket Footer */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <p>Registered: {ticketData.registrationDate}</p>
              <p>Price: ${ticketData.price}</p>
            </div>
            <div className="text-right">
              <p>Powered by EventHub</p>
              <p>eventHub.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700">
          {isDownloading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Ticket
        </Button>

        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>

        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">What's Next?</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Save this ticket to your phone or print it out</li>
                <li>• Add the event to your calendar</li>
                <li>• Check your email for additional event details</li>
                <li>• Follow the organizer for updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
