"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUser, getTickets, type User, type Ticket } from "../../lib/api"

export default function UserProfile() {
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        const [fetchedUser, allTickets] = await Promise.all([
          getUser(Number.parseInt(params.id as string)),
          getTickets(),
        ])
        setUser(fetchedUser || null)
        if (fetchedUser) {
          setAssignedTickets(allTickets.filter((ticket) => ticket.assignedTo === fetchedUser.id))
        }
      }
    }
    fetchData()
  }, [params.id])

  if (!user) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-4">Role: {user.role}</p>
          <h3 className="text-lg font-semibold mb-2">Assigned Tickets</h3>
          <div className="space-y-2">
            {assignedTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>{ticket.location}</span>
                    <Badge
                      variant={
                        ticket.status === "open"
                          ? "destructive"
                          : ticket.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">Priority: {ticket.priority}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

