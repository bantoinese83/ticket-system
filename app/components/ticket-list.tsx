"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchTickets } from "../store/ticketsSlice"
import type { Ticket, TicketStatus } from "../lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"

type SortField = "createdAt" | "priority" | "status"
type SortOrder = "asc" | "desc"

export function TicketList() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const status = useAppSelector((state) => state.tickets.status)
  const error = useAppSelector((state) => state.tickets.error)

  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTickets())
    }
  }, [status, dispatch])

  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      if (sortField === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortField === "priority") {
        const priorityOrder = { low: 0, medium: 1, high: 2 }
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else if (sortField === "status") {
        const statusOrder = { open: 0, "in-progress": 1, resolved: 2 }
        return sortOrder === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status]
      }
      return 0
    })

    setFilteredTickets(filtered)
  }, [searchTerm, statusFilter, tickets, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  if (status === "loading") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (status === "failed") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => handleSort("createdAt")}>
          Date{" "}
          {sortField === "createdAt" &&
            (sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
        <Button variant="outline" onClick={() => handleSort("priority")}>
          Priority{" "}
          {sortField === "priority" &&
            (sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
        <Button variant="outline" onClick={() => handleSort("status")}>
          Status{" "}
          {sortField === "status" &&
            (sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      </div>
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">No tickets found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Link href={`/ticket/${ticket.id}`} key={`ticket-${ticket.id}`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{ticket.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground line-clamp-1">{ticket.location}</span>
                    <Badge
                      variant={
                        ticket.status === "open"
                          ? "destructive"
                          : ticket.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                      className="w-fit"
                    >
                      {ticket.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-2">
                      Reported on: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Priority: {ticket.priority}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

