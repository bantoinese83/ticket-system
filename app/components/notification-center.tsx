"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchNotifications, markNotificationAsRead } from "../store/notificationsSlice"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export function NotificationCenter() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notifications.notifications)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (id: string) => {
    dispatch(markNotificationAsRead(id))
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} onSelect={() => handleNotificationClick(notification.id)}>
                <Card className={`w-full ${notification.read ? "bg-gray-100" : "bg-white"}`}>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

