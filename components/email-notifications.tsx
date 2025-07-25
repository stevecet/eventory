"use client"

import { useState } from "react"
import { Mail, Send, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "confirmation" | "reminder" | "cancellation" | "custom"
}

interface EmailNotification {
  id: string
  type: string
  recipient: string
  subject: string
  status: "sent" | "pending" | "failed"
  sentAt: string
}

export default function EmailNotifications() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [customEmail, setCustomEmail] = useState({ subject: "", content: "", recipients: "" })

  // Mock email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: "event-created",
      name: "Event Creation Confirmation",
      subject: "Your event '{{eventTitle}}' has been created successfully",
      content: `Dear {{organizerName}},

Your event "{{eventTitle}}" has been successfully created and published on EventHub.

Event Details:
- Date: {{eventDate}}
- Time: {{eventTime}}
- Location: {{eventLocation}}
- Capacity: {{eventCapacity}}

You can manage your event and view registrations from your dashboard.

Best regards,
EventHub Team`,
      type: "confirmation",
    },
    {
      id: "registration-confirmation",
      name: "Registration Confirmation",
      subject: "Registration confirmed for {{eventTitle}}",
      content: `Dear {{attendeeName}},

Thank you for registering for "{{eventTitle}}"!

Your Registration Details:
- Registration ID: {{registrationId}}
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Location: {{eventLocation}}
- Ticket Type: {{ticketType}}

Please save this email as your confirmation. You can download your ticket from your dashboard.

We look forward to seeing you at the event!

Best regards,
{{organizerName}}`,
      type: "confirmation",
    },
    {
      id: "event-reminder",
      name: "Event Reminder (24 hours)",
      subject: "Reminder: {{eventTitle}} is tomorrow!",
      content: `Dear {{attendeeName}},

This is a friendly reminder that "{{eventTitle}}" is happening tomorrow!

Event Details:
- Date: {{eventDate}}
- Time: {{eventTime}}
- Location: {{eventLocation}}
- Your Registration ID: {{registrationId}}

Important reminders:
- Please arrive 15 minutes early for check-in
- Bring a valid ID for verification
- Check the weather and dress accordingly

If you need to cancel your registration, please do so as soon as possible.

See you tomorrow!

Best regards,
{{organizerName}}`,
      type: "reminder",
    },
    {
      id: "event-cancellation",
      name: "Event Cancellation Notice",
      subject: "Important: {{eventTitle}} has been cancelled",
      content: `Dear {{attendeeName}},

We regret to inform you that "{{eventTitle}}" scheduled for {{eventDate}} has been cancelled.

Cancellation Details:
- Event: {{eventTitle}}
- Original Date: {{eventDate}}
- Your Registration ID: {{registrationId}}

Refund Information:
{{#if isPaidEvent}}
A full refund will be processed to your original payment method within 5-7 business days.
{{else}}
As this was a free event, no refund processing is required.
{{/if}}

We sincerely apologize for any inconvenience this may cause and appreciate your understanding.

Best regards,
{{organizerName}}`,
      type: "cancellation",
    },
  ]

  // Mock sent notifications
  const sentNotifications: EmailNotification[] = [
    {
      id: "1",
      type: "Registration Confirmation",
      recipient: "john.doe@example.com",
      subject: "Registration confirmed for Tech Conference 2024",
      status: "sent",
      sentAt: "2024-03-15T10:30:00Z",
    },
    {
      id: "2",
      type: "Event Reminder",
      recipient: "jane.smith@example.com",
      subject: "Reminder: Art Workshop is tomorrow!",
      status: "sent",
      sentAt: "2024-03-14T09:00:00Z",
    },
    {
      id: "3",
      type: "Event Creation",
      recipient: "organizer@example.com",
      subject: "Your event has been created successfully",
      status: "pending",
      sentAt: "2024-03-15T11:00:00Z",
    },
  ]

  const handleSendCustomEmail = () => {
    console.log("Sending custom email:", customEmail)
    // In a real app, this would send the email via your email service
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-600">Sent</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Email Notifications</h2>
          <p className="text-gray-600 mt-1">Manage automated emails and communication</p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{template.name}</span>
                    <Badge variant="outline">{template.type}</Badge>
                  </CardTitle>
                  <CardDescription>{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 line-clamp-4">{template.content}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setSelectedTemplate(template)}>
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
              <CardDescription>Track sent and pending email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(notification.status)}
                      <div>
                        <div className="font-medium">{notification.subject}</div>
                        <div className="text-sm text-gray-600">
                          To: {notification.recipient} • {new Date(notification.sentAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(notification.status)}
                      <Badge variant="outline">{notification.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Compose Custom Email
              </CardTitle>
              <CardDescription>Send a custom email to event attendees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  placeholder="Enter email addresses separated by commas"
                  value={customEmail.recipients}
                  onChange={(e) => setCustomEmail({ ...customEmail, recipients: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={customEmail.subject}
                  onChange={(e) => setCustomEmail({ ...customEmail, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your message here..."
                  className="min-h-32"
                  value={customEmail.content}
                  onChange={(e) => setCustomEmail({ ...customEmail, content: e.target.value })}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendCustomEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Subject:</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Content:</Label>
                  <div className="text-sm bg-gray-50 p-4 rounded whitespace-pre-wrap">{selectedTemplate.content}</div>
                </div>
                <div className="flex space-x-2">
                  <Button>Use Template</Button>
                  <Button variant="outline">Edit Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
