'use client'

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface NotificationProps {
  message: string
  type: "info" | "success" | "warning" | "error"
}

const typeToVariantMap: { [key in NotificationProps['type']]: "default" | "destructive" } = {
  info: "default",
  success: "default",
  warning: "destructive",
  error: "destructive"
}

export function Notification({ message, type }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <Alert variant={typeToVariantMap[type]}>
      <AlertTitle className="flex items-center justify-between">
        {type.charAt(0).toUpperCase() + type.slice(1)}
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}