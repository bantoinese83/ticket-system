"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "../store/hooks"
import { submitTicketRating } from "../store/ticketsSlice"
import type { TicketId } from "../lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface RatingSystemProps {
  ticketId: TicketId
  onRatingSubmit: () => void
}

export function RatingSystem({ ticketId, onRatingSubmit }: RatingSystemProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await dispatch(submitTicketRating({ ticketId, rating, feedback })).unwrap()
      onRatingSubmit()
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                variant="ghost"
                size="lg"
                className="p-0"
                onClick={() => setRating(star)}
              >
                <Star className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} size={32} />
              </Button>
            ))}
          </div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide additional feedback (optional)"
            className="w-full"
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

