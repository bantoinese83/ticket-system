'use client'

import { TicketList } from "../components/ticket-list"

export default function TicketsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Tickets</h1>
      <TicketList />
    </div>
  )
}

