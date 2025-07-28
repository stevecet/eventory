"use client"

import type React from "react"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Ticket,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: number
  title: string
  startDate: string
  startTime: string
  location: {
    venue: string
    city: string
    country: string
  }
  price: number
  isFree: boolean
  attendees: number
  maxAttendees: number
  category: string
  image: string
}

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  jobTitle?: string
  dietaryRequirements?: string
  specialRequests?: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
  paymentMethod?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  ticketType: string
}

interface RegistrationFormProps {
  event: Event
  onSubmit: (data: RegistrationData) => void
  onCancel: () => void
  isSubmitting: boolean
}

export default function RegistrationForm({ event, onSubmit, onCancel, isSubmitting }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    dietaryRequirements: "",
    specialRequests: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
    paymentMethod: event.isFree ? undefined : "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    ticketType: "regular",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const spotsRemaining = event.maxAttendees - event.attendees
  const isCapacityReached = spotsRemaining <= 0

  const ticketTypes = [
    { id: "regular", name: "Regular Ticket", price: event.price, description: "Standard access to all sessions" },
    { id: "vip", name: "VIP Ticket", price: event.price * 1.5, description: "Premium access with networking session" },
    { id: "student", name: "Student Ticket", price: event.price * 0.5, description: "Discounted rate for students" },
  ]

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    }

    if (step === 3 && !event.isFree) {
      if (!formData.cardNumber?.trim()) newErrors.cardNumber = "Card number is required"
      if (!formData.expiryDate?.trim()) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv?.trim()) newErrors.cvv = "CVV is required"
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, event.isFree ? 4 : 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(currentStep) && !isCapacityReached) {
      onSubmit(formData)
    }
  }

  const getSelectedTicketPrice = () => {
    const selectedTicket = ticketTypes.find((t) => t.id === formData.ticketType)
    return selectedTicket ? selectedTicket.price : event.price
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

  if (isCapacityReached) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200">
          <CardHeader className="text-center bg-red-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Event Fully Booked</CardTitle>
            <CardDescription className="text-red-600">
              Unfortunately, this event has reached its maximum capacity.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 pt-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                All {event.maxAttendees} spots have been filled. You can join the waitlist to be notified if spots
                become available.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-3 justify-center">
              <Button variant="outline" onClick={onCancel}>
                Back to Event
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Join Waitlist</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Registration</h1>
        <p className="text-gray-600">You're just a few steps away from joining this amazing event!</p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <Progress value={(currentStep / 4) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Event Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <span>Event Summary</span>
            {spotsRemaining <= 10 && spotsRemaining > 0 && (
              <Badge className="bg-amber-500 text-white animate-pulse">Only {spotsRemaining} spots left!</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
              <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="mr-2 h-4 w-4 text-red-500" />
              {event.location.venue}, {event.location.city}
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="mr-2 h-4 w-4 text-purple-500" />
              {event.attendees + 1}/{event.maxAttendees} attendees
            </div>
            <div className="flex items-center text-gray-700">
              <DollarSign className="mr-2 h-4 w-4 text-emerald-500" />
              {event.isFree ? "Free Event" : `$${getSelectedTicketPrice()}`}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <User className="mr-2 h-5 w-5 text-blue-500" />
                Personal Information
              </CardTitle>
              <CardDescription>Please provide your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500 focus:border-red-500" : ""}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500 focus:border-red-500" : ""}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className={`pl-10 ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="Your job title"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Ticket Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Ticket className="mr-2 h-5 w-5 text-purple-500" />
                Select Your Ticket
              </CardTitle>
              <CardDescription>Choose the ticket type that best suits your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!event.isFree ? (
                <div className="grid gap-4">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.ticketType === ticket.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleInputChange("ticketType", ticket.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              formData.ticketType === ticket.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {formData.ticketType === ticket.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">${ticket.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">Free Event</h3>
                  <p className="text-emerald-700">No payment required - just complete your registration!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment Information */}
        {currentStep === 3 && !event.isFree && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <CreditCard className="mr-2 h-5 w-5 text-emerald-500" />
                Payment Information
              </CardTitle>
              <CardDescription>Secure payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Your payment information is secure and encrypted with industry-standard SSL protection.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple-pay">Apple Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? "border-red-500 focus:border-red-500" : ""}
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    />
                    {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        className={errors.expiryDate ? "border-red-500 focus:border-red-500" : ""}
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      />
                      {errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className={errors.cvv ? "border-red-500 focus:border-red-500" : ""}
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                      />
                      {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-emerald-600">${getSelectedTicketPrice()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Including all taxes and fees</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Additional Information & Terms */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Additional Information & Terms</CardTitle>
              <CardDescription>Final details and agreement to terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dietaryRequirements">Dietary Requirements (Optional)</Label>
                  <Input
                    id="dietaryRequirements"
                    placeholder="e.g., Vegetarian, Gluten-free, Allergies"
                    value={formData.dietaryRequirements}
                    onChange={(e) => handleInputChange("dietaryRequirements", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special accommodations or requests..."
                    className="min-h-20"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>{" "}
                      *
                    </Label>
                    {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm leading-relaxed">
                    Subscribe to our newsletter for updates on future events and exclusive offers
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : event.isFree ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Pay ${getSelectedTicketPrice()} & Register
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
