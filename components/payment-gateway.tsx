"use client"

import { useState } from "react"
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PaymentGatewayProps {
  amount: number
  eventTitle: string
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
}

export default function PaymentGateway({ amount, eventTitle, onPaymentSuccess, onPaymentError }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success" | "error">("form")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock payment success
      const paymentData = {
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        status: "completed",
      }

      setPaymentStep("success")
      onPaymentSuccess(paymentData)
    } catch (error) {
      setPaymentStep("error")
      onPaymentError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripePayment = () => {
    console.log("Processing Stripe payment...")
    handlePayment()
  }

  const handlePayPalPayment = () => {
    console.log("Processing PayPal payment...")
    handlePayment()
  }

  if (paymentStep === "processing") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === "success") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
            <p className="text-gray-600">Your registration has been confirmed.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === "error") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-lg font-semibold text-red-800">Payment Failed</h3>
            <p className="text-gray-600">There was an issue processing your payment.</p>
            <Button onClick={() => setPaymentStep("form")} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Complete your registration for {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">${amount}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="apple-pay">Apple Pay</SelectItem>
              <SelectItem value="google-pay">Google Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Payment Forms */}
        {paymentMethod === "stripe" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleStripePayment} className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay $${amount}`}
            </Button>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment</p>
              <Button onClick={handlePayPalPayment} className="bg-blue-600 hover:bg-blue-700" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Continue with PayPal`}
              </Button>
            </div>
          </div>
        )}

        {(paymentMethod === "apple-pay" || paymentMethod === "google-pay") && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                Use your {paymentMethod === "apple-pay" ? "Touch ID or Face ID" : "fingerprint or PIN"} to complete
                payment
              </p>
              <Button onClick={handlePayment} className="w-full" disabled={isProcessing}>
                {isProcessing
                  ? "Processing..."
                  : `Pay with ${paymentMethod === "apple-pay" ? "Apple Pay" : "Google Pay"}`}
              </Button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Accepted Cards */}
        <div className="flex justify-center space-x-2">
          <Badge variant="outline">Visa</Badge>
          <Badge variant="outline">Mastercard</Badge>
          <Badge variant="outline">Amex</Badge>
          <Badge variant="outline">Discover</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
