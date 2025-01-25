"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchUsers } from "../store/usersSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function UserList() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const status = useAppSelector((state) => state.users.status)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers())
    }
  }, [status, dispatch])

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Link href={`/profile/${user.id}`} key={user.id} className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
              <p className="text-sm mt-2">Assigned Tickets: {user.assignedTickets.length}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

