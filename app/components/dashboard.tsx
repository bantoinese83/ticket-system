"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchTickets } from "../store/ticketsSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function Dashboard() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const status = useAppSelector((state) => state.tickets.status)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTickets())
    }
  }, [status, dispatch])

  const statusCounts = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const priorityCounts = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
