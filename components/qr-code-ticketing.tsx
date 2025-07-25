"use client"

import { useState } from "react"
import { QrCode, Download, Scan, CheckCircle, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QRTicket {
  id: string
  eventId: number
  eventTitle: string
  attendeeName: string
  attendeeEmail: string
  registrationId: string
  qrCode: string
  isUsed: boolean
  checkedInAt?: string
}

interface QRCodeTicketingProps {
  mode: "generate" | "scan"
  ticket?: QRTicket
  onScan?: (qrData: string) => void
}

export default function QRCodeTicketing({ mode, ticket, onScan }: QRCodeTicketingProps) {
  const [scanResult, setScanResult] = useState<any>(null)
  const [manualCode, setManualCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  // Mock QR ticket data
  const mockTicket: QRTicket = ticket || {
    id: "ticket_123456",
    eventId: 1,
    eventTitle: "Tech Conference 2024",
    attendeeName: "John Doe",
    attendeeEmail: "john.doe@example.com",
    registrationId: "REG-2024-001",
    qrCode: "QR_CODE_DATA_HERE",
    isUsed: false,
  }

  const generateQRCodeSVG = (data: string) => {
    // This is a simplified QR code representation
    // In a real app, you'd use a proper QR code library like qrcode
    return `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="10" y="10" width="20" height="20" fill="black"/>
        <rect x="40" y="10" width="20" height="20" fill="black"/>
        <rect x="70" y="10" width="20" height="20" fill="black"/>
        <rect x="10" y="40" width="20" height="20" fill="black"/>
        <rect x="70" y="40" width="20" height="20" fill="black"/>
        <rect x="10" y="70" width="20" height="20" fill="black"/>
        <rect x="40" y="70" width="20" height="20" fill="black"/>
        <rect x="70" y="70" width="20" height="20" fill="black"/>
        <!-- More QR pattern would go here -->
        <text x="100" y="100" fontFamily="Arial" fontSize="8" textAnchor="middle">${data}</text>
      </svg>
    `
  }

  const handleDownloadTicket = () => {
    const ticketData = {
      ...mockTicket,
      qrCodeSVG: generateQRCodeSVG(mockTicket.qrCode),
    }

    // Generate PDF ticket (mock implementation)
    console.log("Generating PDF ticket:", ticketData)

    // In a real app, you'd generate a proper PDF with libraries like jsPDF
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket_${mockTicket.registrationId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleScanQR = (qrData: string) => {
    // Mock scan result
    const scannedTicket = {
      ...mockTicket,
      qrCode: qrData,
      isValid: true,
      attendeeName: "John Doe",
      eventTitle: "Tech Conference 2024",
    }

    setScanResult(scannedTicket)
    if (onScan) onScan(qrData)
  }

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      handleScanQR(manualCode.trim())
    }
  }

  const handleCheckIn = () => {
    console.log("Checking in attendee:", scanResult)
    setScanResult({ ...scanResult, checkedIn: true, checkedInAt: new Date().toISOString() })
  }

  if (mode === "generate") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Your Event Ticket
            </CardTitle>
            <CardDescription>Present this QR code at the event for check-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ticket Information */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{mockTicket.eventTitle}</h3>
                  <p className="text-blue-100">March 15, 2024 • 9:00 AM</p>
                </div>
                <Badge className="bg-white text-blue-600">VIP</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Attendee</p>
                  <p className="font-medium">{mockTicket.attendeeName}</p>
                </div>
                <div>
                  <p className="text-blue-200">Registration ID</p>
                  <p className="font-medium">{mockTicket.registrationId}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateQRCodeSVG(mockTicket.qrCode),
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">Scan this QR code at the event entrance</p>
            </div>

            {/* Ticket Actions */}
            <div className="flex space-x-2">
              <Button onClick={handleDownloadTicket} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Add to Wallet
              </Button>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 15 minutes early for check-in</li>
                <li>• Bring a valid ID for verification</li>
                <li>• This QR code is unique and cannot be transferred</li>
                <li>• Screenshot or download this ticket for offline access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "scan") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scan className="mr-2 h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan attendee tickets for event check-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!scanResult ? (
              <>
                {/* Camera Scanner */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    {isScanning ? (
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Camera scanning active</p>
                        <Button variant="outline" onClick={() => setIsScanning(false)} className="mt-2">
                          Stop Scanning
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                        <Button onClick={() => setIsScanning(true)}>
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-2">
                    <Label htmlFor="manualCode">Or enter code manually:</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="manualCode"
                        placeholder="Enter QR code or registration ID"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                      <Button onClick={handleManualEntry}>Verify</Button>
                    </div>
                  </div>

                  {/* Quick Test */}
                  <div className="text-center">
                    <Button variant="outline" onClick={() => handleScanQR("QR_CODE_DATA_HERE")}>
                      Test with Sample QR Code
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Scan Result */
              <div className="space-y-4">
                {scanResult.isValid ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">Valid Ticket</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-700 font-medium">Attendee:</p>
                        <p className="text-green-800">{scanResult.attendeeName}</p>
                      </div>
                      <div>
                        <p className="text-green-700 font-medium">Event:</p>
                        <p className="text-green-800">{scanResult.eventTitle}</p>
                      </div>
                      <div>
                        <p className="text-green-700 font-medium">Registration ID:</p>
                        <p className="text-green-800">{mockTicket.registrationId}</p>
                      </div>
                      <div>
                        <p className="text-green-700 font-medium">Status:</p>
                        <Badge className="bg-green-600">{scanResult.checkedIn ? "Checked In" : "Valid"}</Badge>
                      </div>
                    </div>

                    {!scanResult.checkedIn && (
                      <Button onClick={handleCheckIn} className="mt-4 w-full">
                        Check In Attendee
                      </Button>
                    )}

                    {scanResult.checkedIn && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-blue-800 text-sm">
                          ✓ Checked in at {new Date(scanResult.checkedInAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <X className="h-6 w-6 text-red-600 mr-2" />
                      <h3 className="text-lg font-semibold text-red-800">Invalid Ticket</h3>
                    </div>
                    <p className="text-red-700">This QR code is not valid or has already been used.</p>
                  </div>
                )}

                <Button variant="outline" onClick={() => setScanResult(null)} className="w-full">
                  Scan Another Ticket
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
