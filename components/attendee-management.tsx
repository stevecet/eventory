"use client"

import { useState, useMemo } from "react"
import {
  Users,
  Download,
  Search,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  MoreHorizontal,
  UserCheck,
  UserX,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Attendee {
  id: number
  registrationId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  jobTitle?: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt?: string
  ticketType: "regular" | "vip" | "student"
  paymentStatus: "paid" | "pending" | "refunded"
  dietaryRequirements?: string
  specialRequests?: string
  source: "website" | "social" | "referral" | "direct"
}

interface Event {
  id: number
  title: string
  startDate: string
  startTime: string
  location: {
    venue: string
    city: string
  }
  maxAttendees: number
}

interface AttendeeManagementProps {
  event: Event
  onBack: () => void
}

export default function AttendeeManagement({ event, onBack }: AttendeeManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>("all")
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])
  const [isExporting, setIsExporting] = useState(false)

  // Mock attendee data
  const attendees: Attendee[] = [
    {
      id: 1,
      registrationId: "REG-2024-001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Corp",
      jobTitle: "Software Engineer",
      registeredAt: "2024-02-15T10:30:00Z",
      checkedIn: true,
      checkedInAt: "2024-03-15T08:45:00Z",
      ticketType: "regular",
      paymentStatus: "paid",
      dietaryRequirements: "Vegetarian",
      source: "website",
    },
    {
      id: 2,
      registrationId: "REG-2024-002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      company: "Design Studio",
      jobTitle: "UX Designer",
      registeredAt: "2024-02-18T14:20:00Z",
      checkedIn: false,
      ticketType: "vip",
      paymentStatus: "paid",
      specialRequests: "Wheelchair accessible seating",
      source: "social",
    },
    {
      id: 3,
      registrationId: "REG-2024-003",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@university.edu",
      phone: "+1 (555) 345-6789",
      company: "State University",
      jobTitle: "Student",
      registeredAt: "2024-02-20T09:15:00Z",
      checkedIn: false,
      ticketType: "student",
      paymentStatus: "paid",
      source: "referral",
    },
    {
      id: 4,
      registrationId: "REG-2024-004",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@startup.com",
      phone: "+1 (555) 456-7890",
      company: "Startup Inc",
      jobTitle: "Product Manager",
      registeredAt: "2024-02-22T16:45:00Z",
      checkedIn: true,
      checkedInAt: "2024-03-15T09:12:00Z",
      ticketType: "regular",
      paymentStatus: "paid",
      dietaryRequirements: "Gluten-free",
      source: "direct",
    },
    {
      id: 5,
      registrationId: "REG-2024-005",
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@freelance.com",
      phone: "+1 (555) 567-8901",
      jobTitle: "Freelance Developer",
      registeredAt: "2024-02-25T11:30:00Z",
      checkedIn: false,
      ticketType: "regular",
      paymentStatus: "pending",
      source: "website",
    },
  ]

  // Filter attendees based on search and filters
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      const matchesSearch =
        attendee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.registrationId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "checked-in" && attendee.checkedIn) ||
        (statusFilter === "not-checked-in" && !attendee.checkedIn) ||
        (statusFilter === "paid" && attendee.paymentStatus === "paid") ||
        (statusFilter === "pending" && attendee.paymentStatus === "pending")

      const matchesTicketType = ticketTypeFilter === "all" || attendee.ticketType === ticketTypeFilter

      return matchesSearch && matchesStatus && matchesTicketType
    })
  }, [attendees, searchQuery, statusFilter, ticketTypeFilter])

  // Statistics
  const stats = useMemo(() => {
    const total = attendees.length
    const checkedIn = attendees.filter((a) => a.checkedIn).length
    const paid = attendees.filter((a) => a.paymentStatus === "paid").length
    const pending = attendees.filter((a) => a.paymentStatus === "pending").length

    return { total, checkedIn, paid, pending }
  }, [attendees])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendees(filteredAttendees.map((a) => a.id))
    } else {
      setSelectedAttendees([])
    }
  }

  const handleSelectAttendee = (attendeeId: number, checked: boolean) => {
    if (checked) {
      setSelectedAttendees((prev) => [...prev, attendeeId])
    } else {
      setSelectedAttendees((prev) => prev.filter((id) => id !== attendeeId))
    }
  }

  const handleCheckIn = (attendeeId: number) => {
    console.log("Checking in attendee:", attendeeId)
    // In a real app, this would update the backend
  }

  const handleCheckOut = (attendeeId: number) => {
    console.log("Checking out attendee:", attendeeId)
    // In a real app, this would update the backend
  }

  const handleBulkCheckIn = () => {
    console.log("Bulk checking in attendees:", selectedAttendees)
    setSelectedAttendees([])
  }

  const handleSendEmail = (attendeeIds: number[]) => {
    console.log("Sending email to attendees:", attendeeIds)
    // In a real app, this would open an email composer or send emails
  }

  const exportToCSV = () => {
    setIsExporting(true)

    // Prepare CSV data
    const headers = [
      "Registration ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
      "Job Title",
      "Ticket Type",
      "Payment Status",
      "Checked In",
      "Check-in Time",
      "Registration Date",
      "Dietary Requirements",
      "Special Requests",
      "Source",
    ]

    const csvData = [
      headers,
      ...filteredAttendees.map((attendee) => [
        attendee.registrationId,
        attendee.firstName,
        attendee.lastName,
        attendee.email,
        attendee.phone,
        attendee.company || "",
        attendee.jobTitle || "",
        attendee.ticketType,
        attendee.paymentStatus,
        attendee.checkedIn ? "Yes" : "No",
        attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleString() : "",
        new Date(attendee.registeredAt).toLocaleString(),
        attendee.dietaryRequirements || "",
        attendee.specialRequests || "",
        attendee.source,
      ]),
    ]

    // Create and download CSV
    const csvContent = csvData.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${event.title.replace(/\s+/g, "_")}_attendees_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => setIsExporting(false), 1000)
  }

  const exportToExcel = () => {
    // Similar to CSV but with Excel format
    console.log("Exporting to Excel format")
    // In a real app, you'd use a library like xlsx
  }

  const getStatusBadge = (attendee: Attendee) => {
    if (attendee.checkedIn) {
      return <Badge className="bg-green-600">Checked In</Badge>
    }
    if (attendee.paymentStatus === "pending") {
      return <Badge variant="destructive">Payment Pending</Badge>
    }
    return <Badge variant="secondary">Registered</Badge>
  }

  const getTicketTypeBadge = (type: string) => {
    const colors = {
      regular: "bg-blue-600",
      vip: "bg-purple-600",
      student: "bg-orange-600",
    }
    return <Badge className={colors[type as keyof typeof colors]}>{type.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← Back to Events
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Attendee Management</h2>
          <p className="text-gray-600 mt-1">
            {event.title} - {new Date(event.startDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export as CSV"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedAttendees.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Actions ({selectedAttendees.length})</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleBulkCheckIn}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Bulk Check-in
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSendEmail(selectedAttendees)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">of {event.maxAttendees} capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.checkedIn / stats.total) * 100)}% of attendees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.paid / stats.total) * 100)}% payment complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Require follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>Manage and view all registered attendees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attendees</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="not-checked-in">Not Checked In</SelectItem>
                <SelectItem value="paid">Payment Complete</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ticketTypeFilter} onValueChange={setTicketTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ticket Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAttendees.length} of {attendees.length} attendees
            </p>
            {filteredAttendees.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedAttendees.length === filteredAttendees.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm">
                  Select all visible
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendee Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.id)}
                        onCheckedChange={(checked) => handleSelectAttendee(attendee.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32&query=${attendee.firstName} ${attendee.lastName}`}
                          />
                          <AvatarFallback>
                            {attendee.firstName[0]}
                            {attendee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {attendee.firstName} {attendee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{attendee.registrationId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {attendee.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="mr-1 h-3 w-3" />
                          {attendee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{attendee.company || "—"}</div>
                        <div className="text-sm text-gray-500">{attendee.jobTitle || "—"}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTicketTypeBadge(attendee.ticketType)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(attendee)}
                        {attendee.checkedIn && attendee.checkedInAt && (
                          <div className="text-xs text-gray-500">{new Date(attendee.checkedInAt).toLocaleString()}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(attendee.registeredAt).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {attendee.checkedIn ? (
                            <DropdownMenuItem onClick={() => handleCheckOut(attendee.id)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Check Out
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleCheckIn(attendee.id)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Check In
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleSendEmail([attendee.id])}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all" || ticketTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No one has registered for this event yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Details Section */}
      <Tabs defaultValue="dietary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dietary">Dietary Requirements</TabsTrigger>
          <TabsTrigger value="special">Special Requests</TabsTrigger>
          <TabsTrigger value="sources">Registration Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="dietary">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Requirements Summary</CardTitle>
              <CardDescription>Overview of attendee dietary needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(
                  attendees.reduce(
                    (acc, attendee) => {
                      if (attendee.dietaryRequirements) {
                        const req = attendee.dietaryRequirements
                        acc[req] = (acc[req] || 0) + 1
                      }
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).map(([requirement, count]) => (
                  <div key={requirement} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{requirement}</span>
                    <Badge variant="secondary">
                      {count} attendee{count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))}
                {Object.keys(
                  attendees.reduce(
                    (acc, attendee) => {
                      if (attendee.dietaryRequirements) {
                        const req = attendee.dietaryRequirements
                        acc[req] = (acc[req] || 0) + 1
                      }
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).length === 0 && <p className="text-gray-500 text-center py-4">No dietary requirements specified</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="special">
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
              <CardDescription>Attendee accommodation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendees
                  .filter((a) => a.specialRequests)
                  .map((attendee) => (
                    <div key={attendee.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {attendee.firstName} {attendee.lastName}
                        </span>
                        <span className="text-sm text-gray-500">{attendee.email}</span>
                      </div>
                      <p className="text-sm text-gray-700">{attendee.specialRequests}</p>
                    </div>
                  ))}
                {attendees.filter((a) => a.specialRequests).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No special requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Registration Sources</CardTitle>
              <CardDescription>How attendees found your event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(
                  attendees.reduce(
                    (acc, attendee) => {
                      acc[attendee.source] = (acc[attendee.source] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).map(([source, count]) => (
                  <div key={source} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{source}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
