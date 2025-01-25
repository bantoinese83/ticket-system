"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTicket, updateStatus, assignUser, addComment, deleteComment } from "@/store/ticketsSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const commentSchema = z.object({
  content: z.string().min(1, "Comment is required"),
})

export default function TicketPage() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const ticket = useAppSelector((state) => state.tickets.tickets.find((t) => t.id === Number(id)))
  const [isLoading, setIsLoading] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [assignedUserId, setAssignedUserId] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(commentSchema),
  })

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      dispatch(fetchTicket(Number(id)))
        .unwrap()
        .finally(() => setIsLoading(false))
    }
  }, [id, dispatch])

  const handleAssignUser = async () => {
    if (assignedUserId !== null) {
      setIsAssigning(true)
      try {
        await dispatch(assignUser({ ticketId: Number(id), userId: assignedUserId })).unwrap()
        toast({
          title: "User Assigned",
          description: "User has been successfully assigned to the ticket.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      } finally {
        setIsAssigning(false)
      }
    }
  }

  const handleUpdateStatus = async () => {
    if (status !== null) {
      setIsUpdatingStatus(true)
      try {
        await dispatch(updateStatus({ ticketId: Number(id), status: status as any, userId: 1 })).unwrap()
        toast({
          title: "Status Updated",
          description: "Ticket status has been successfully updated.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      } finally {
        setIsUpdatingStatus(false)
      }
    }
  }

  const handleAddComment = async (data: { content: string }) => {
    setIsAddingComment(true)
    try {
      await dispatch(addComment({ ticketId: Number(id), userId: 1, content: data.content })).unwrap()
      reset()
      toast({
        title: "Comment Added",
        description: "Your comment has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    } finally {
      setIsAddingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setIsDeleting(true)
    try {
      await dispatch(deleteComment({ ticketId: Number(id), commentId })).unwrap()
      toast({
        title: "Comment Deleted",
        description: "Comment has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSuggestSolutions = () => {
    // Implement the logic to suggest solutions
  }

  useEffect(() => {
    handleSuggestSolutions()
  }, [handleSuggestSolutions])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!ticket) {
    return <div>Ticket not found</div>
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
          <p>Reported by: {ticket.reportedBy}</p>
          <p>Assigned to: {ticket.assignedTo}</p>
          <p>Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
          <p>Updated at: {new Date(ticket.updatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign User</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="number"
            value={assignedUserId ?? ""}
            onChange={(e) => setAssignedUserId(Number(e.target.value))}
            placeholder="Enter user ID"
          />
          <Button onClick={handleAssignUser} disabled={isAssigning}>
            {isAssigning ? "Assigning..." : "Assign User"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <select value={status ?? ""} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
            {isUpdatingStatus ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {ticket.comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <p>{comment.content}</p>
              <p>By: {comment.author}</p>
              <p>At: {new Date(comment.createdAt).toLocaleString()}</p>
              <Button onClick={() => handleDeleteComment(comment.id)} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Comment"}
              </Button>
            </div>
          ))}
          <form onSubmit={handleSubmit(handleAddComment)} className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              {...register("content")}
            />
            {errors.content && <p className="text-red-500">{errors.content.message}</p>}
            <Button type="submit" disabled={isAddingComment}>
              {isAddingComment ? "Adding..." : "Add Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
