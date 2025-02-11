import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your team's activity.
        </p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Quick Actions
      </Button>
    </div>
  )
}