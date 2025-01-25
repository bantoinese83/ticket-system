"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTicket, updateStatus, assignUser, addComment, deleteComment, editComment } from "@/store/ticketsSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2 } from "lucide-react"
import { CommentSection } from "@/components/comment-section"
import { StatusHistory } from "@/components/status-history"
import { RatingSystem } from "@/components/rating-system"
import { TicketId, UserId, CommentId, TicketStatus } from "@/lib/api"

interface TicketPageProps {
  id: TicketId
}

export default function TicketPage({ id }: TicketPageProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const ticket = useAppSelector((state) => state.tickets.tickets.find((t) => t.id === id))
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<CommentId | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<TicketStatus>("open")
  const [assignedUser, setAssignedUser] = useState<UserId | null>(null)

  useEffect(() => {
    if (!ticket) {
      dispatch(fetchTicket(id))
    }
  }, [id, ticket, dispatch])

  const handleSuggestSolutions = useCallback(() => {
    // Implement the logic to suggest solutions here
  }, [])

  useEffect(() => {
    handleSuggestSolutions()
  }, [handleSuggestSolutions])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      setIsSubmitting(true)
      try {
        const currentUserId: UserId = 1 // This is a placeholder
        await dispatch(
          addComment({
            ticketId: id,
            userId: currentUserId,
            content: newComment,
          }),
        ).unwrap()
        setNewComment("")
        toast({
          title: "Comment Added",
          description: "Your comment has been successfully added.",
        })
      } catch (error) {
        console.error("Error adding comment:", error)
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditComment = async (commentId: CommentId) => {
    if (editedContent.trim()) {
      try {
        await dispatch(
          editComment({
            ticketId: id,
            commentId,
            content: editedContent,
          }),
        ).unwrap()
        setEditingCommentId(null)
        toast({
          title: "Comment Updated",
          description: "Your comment has been successfully updated.",
        })
      } catch (error) {
        console.error("Error editing comment:", error)
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteComment = async (commentId: CommentId) => {
    try {
      await dispatch(
        deleteComment({
          ticketId: id,
          commentId,
        }),
      ).unwrap()
      toast({
        title: "Comment Deleted",
        description: "Your comment has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    try {
      const currentUserId: UserId = 1 // This is a placeholder
      await dispatch(updateStatus({ ticketId: id, status: newStatus, userId: currentUserId })).unwrap()
      setStatus(newStatus)
      toast({
        title: "Status Updated",
        description: `Ticket status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  const handleAssignUser = async (userId: UserId) => {
    try {
      await dispatch(assignUser({ ticketId: id, userId })).unwrap()
      setAssignedUser(userId)
      toast({
        title: "User Assigned",
        description: "User has been successfully assigned to the ticket.",
      })
    } catch (error) {
      console.error("Error assigning user:", error)
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  if (!ticket) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Location: {ticket.location}</p>
          <p>Reported by: User {ticket.reportedBy}</p>
          <p>Assigned to: {ticket.assignedTo ? `User ${ticket.assignedTo}` : "Unassigned"}</p>
          <p>Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
          <p>Updated at: {new Date(ticket.updatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <CommentSection ticketId={id} comments={ticket.comments} />

      <StatusHistory history={ticket.statusHistory} />

      <RatingSystem ticketId={id} onRatingSubmit={() => {}} />

      <form onSubmit={handleSubmitComment} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  )
}
