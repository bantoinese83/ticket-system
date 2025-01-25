"use client"

import { useState } from "react"
import { useAppSelector } from "../store/hooks"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ExportData() {
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const { toast } = useToast()
  const [exportType, setExportType] = useState<"all" | "open" | "resolved">("all")

  const exportTickets = () => {
    let ticketData = tickets
    if (exportType === "open") {
      ticketData = tickets.filter((ticket) => ticket.status === "open")
    } else if (exportType === "resolved") {
      ticketData = tickets.filter((ticket) => ticket.status === "resolved")
    }

    const csvData = ticketData.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      assignedTo: ticket.assignedTo,
      reportedBy: ticket.reportedBy,
      location: ticket.location,
      description: ticket.description,
    }))

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Title,Status,Priority,Created At,Updated At,Assigned To,Reported By,Location,Description\n" +
      csvData
        .map((t) =>
          Object.values(t)
            .map((v) => `"${v}"`)
            .join(","),
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `tickets_export_${exportType}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `${exportType === "all" ? "All tickets" : `${exportType} tickets`} have been exported to CSV.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Select value={exportType} onValueChange={(value: "all" | "open" | "resolved") => setExportType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select export type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open Tickets</SelectItem>
            <SelectItem value="resolved">Resolved Tickets</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={exportTickets}>
          <Download className="mr-2 h-4 w-4" /> Export Tickets
        </Button>
      </CardContent>
    </Card>
  )
}

