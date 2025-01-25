"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchTicket, updateStatus, assignUser } from "../../store/ticketsSlice"
import { fetchUsers } from "../../store/usersSlice"
import { CommentSection } from "../../components/comment-section"
import { RatingSystem } from "../../components/rating-system"
import { StatusHistory } from "../../components/status-history"
import { suggestSolutions } from "../../utils/geminiApi"
import type { TicketStatus, UserId } from "../../lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function TicketDetail() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const ticket = useAppSelector((state) => state.tickets.tickets.find((t) => t.id === Number(params.id)))
  const users = useAppSelector((state) => state.users.users)
  const ticketStatus = useAppSelector((state) => state.tickets.status)
  const usersStatus = useAppSelector((state) => state.users.status)
  const ticketError = useAppSelector((state) => state.tickets.error)
  const usersError = useAppSelector((state) => state.users.error)
  const [suggestedSolutions, setSuggestedSolutions] = useState("")
  const [isLoadingSolutions, setIsLoadingSolutions] = useState(false)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTicket(Number(params.id)))
      dispatch(fetchUsers())
    }
  }, [dispatch, params.id])

  useEffect(() => {
    if (ticket && !suggestedSolutions) {
      handleSuggestSolutions()
    }
  }, [ticket, suggestedSolutions]) // Added suggestedSolutions to dependencies

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (ticket) {
      try {
        await dispatch(updateStatus({ ticketId: ticket.id, status: newStatus })).unwrap()
        toast({
          title: "Status Updated",
          description: `Ticket status updated to ${newStatus}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      }
    }
  }

  const handleAssignUser = async (userId: UserId) => {
    if (ticket) {
      try {
        await dispatch(assignUser({ ticketId: ticket.id, userId })).unwrap()
        toast({
          title: "User Assigned",
          description: "Ticket assigned successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      }
    }
  }

  const handleRatingSubmit = () => {
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    })
  }

  const handleSuggestSolutions = async () => {
    if (ticket) {
      setIsLoadingSolutions(true)
      try {
        const solutions = await suggestSolutions(ticket.description)
        setSuggestedSolutions(solutions)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate solution suggestions",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSolutions(false)
      }
    }
  }

  if (ticketStatus === "loading" || usersStatus === "loading") {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    )
  }

  if (ticketError || usersError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{ticketError || usersError}</AlertDescription>
      </Alert>
    )
  }

  if (!ticket)
    return (
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The requested ticket could not be found.</AlertDescription>
      </Alert>
    )

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{ticket.description}</p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-sm">{ticket.location}</span>
            <Badge
              variant={
                ticket.status === "open" ? "destructive" : ticket.status === "in-progress" ? "default" : "secondary"
              }
            >
              {ticket.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Reported on: {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <Select onValueChange={(value) => handleStatusChange(value as TicketStatus)} defaultValue={ticket.status}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium">Assigned to:</span>
            <Select
              onValueChange={(value) => handleAssignUser(Number(value) as UserId)}
              defaultValue={ticket.assignedTo?.toString() || ""}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Assign user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {ticket.statusHistory && ticket.statusHistory.length > 0 && (
            <div className="mt-6">
              <StatusHistory history={ticket.statusHistory} />
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>AI-Suggested Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSolutions ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <p>{suggestedSolutions || "No suggestions available."}</p>
              )}
              <Button onClick={handleSuggestSolutions} disabled={isLoadingSolutions} className="mt-4">
                {isLoadingSolutions ? "Generating..." : "Regenerate Suggestions"}
              </Button>
            </CardContent>
          </Card>
          <CommentSection ticketId={ticket.id} comments={ticket.comments} />
          {ticket.status === "resolved" && !ticket.rating && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Rate Resolution</h3>
              <RatingSystem ticketId={ticket.id} onRatingSubmit={handleRatingSubmit} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

