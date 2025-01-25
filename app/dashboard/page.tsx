"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketList } from "../components/ticket-list"
import { UserList } from "../components/user-list"
import { Dashboard } from "../components/dashboard"
import { ExportData } from "../components/export-data"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Dashboard />
        </TabsContent>
        <TabsContent value="tickets">
          <TicketList />
        </TabsContent>
        <TabsContent value="users">
          <UserList />
        </TabsContent>
        <TabsContent value="export">
          <ExportData />
        </TabsContent>
      </Tabs>
    </div>
  )
}

