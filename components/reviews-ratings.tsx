"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageCircle, Flag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface Review {
  id: number
  userId: number
  userName: string
  userAvatar: string
  rating: number
  title: string
  content: string
  createdAt: string
  helpful: number
  eventId: number
  verified: boolean
}

interface ReviewsRatingsProps {
  eventId: number
  eventTitle: string
  canReview?: boolean
}

export default function ReviewsRatings({ eventId, eventTitle, canReview = false }: ReviewsRatingsProps) {
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: 1,
      userId: 1,
      userName: "John Doe",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      title: "Excellent event, highly recommend!",
      content:
        "This was an amazing conference with great speakers and networking opportunities. The organization was top-notch and I learned so much. Definitely worth the investment!",
      createdAt: "2024-03-10T14:30:00Z",
      helpful: 12,
      eventId,
      verified: true,
    },
    {
      id: 2,
      userId: 2,
      userName: "Jane Smith",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      title: "Great content, minor venue issues",
      content:
        "The speakers were fantastic and the content was very relevant. However, the venue was a bit crowded and the WiFi was spotty. Overall, still a valuable experience.",
      createdAt: "2024-03-08T10:15:00Z",
      helpful: 8,
      eventId,
      verified: true,
    },
    {
      id: 3,
      userId: 3,
      userName: "Mike Johnson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 3,
      title: "Average event, expected more",
      content:
        "The event was okay but didn't meet my expectations. Some sessions were repetitive and the networking time was limited. Food was good though.",
      createdAt: "2024-03-05T16:45:00Z",
      helpful: 3,
      eventId,
      verified: false,
    },
  ]

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.content.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Submitting review:", newReview)
      // Reset form
      setNewReview({ rating: 0, title: "", content: "" })
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpful = (reviewId: number) => {
    console.log("Marking review as helpful:", reviewId)
  }

  const handleReport = (reviewId: number) => {
    console.log("Reporting review:", reviewId)
  }

  const StarRating = ({ rating, size = "sm", interactive = false, onRatingChange }: any) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === "lg" ? "h-6 w-6" : "h-4 w-4"} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
          <CardDescription>What attendees are saying about {eventTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <div className="text-sm text-gray-600">{reviews.length} reviews</div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience with other attendees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarRating
                rating={newReview.rating}
                size="lg"
                interactive
                onRatingChange={(rating: number) => setNewReview({ ...newReview, rating })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewTitle">Review Title (Optional)</Label>
              <input
                id="reviewTitle"
                className="w-full p-2 border rounded-md"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewContent">Your Review</Label>
              <Textarea
                id="reviewContent"
                placeholder="Tell others about your experience..."
                className="min-h-24"
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={newReview.rating === 0 || !newReview.content.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">All Reviews</h3>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Attendee
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  {review.title && <h4 className="font-medium">{review.title}</h4>}
                  <p className="text-gray-700">{review.content}</p>
                </div>

                <Separator />

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReport(review.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Flag className="mr-1 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
