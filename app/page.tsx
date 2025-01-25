import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Accessibility Issue Ticketing System</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Report a new accessibility issue by submitting a ticket.</p>
            <Link href="/submit">
              <Button>Submit New Issue</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>View Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Browse and manage existing accessibility tickets.</p>
            <Link href="/tickets">
              <Button>View Tickets</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and manage user accounts and permissions.</p>
            <Link href="/users">
              <Button>Manage Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

