import type { StatusChange } from "../lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusHistoryProps {
  history: StatusChange[]
}

export function StatusHistory({ history }: StatusHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {history.map((change, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{change.status}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(change.changedAt).toLocaleString()} by User {change.changedBy}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

