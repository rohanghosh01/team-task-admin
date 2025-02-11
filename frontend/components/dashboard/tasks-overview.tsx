"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { recentTasksApi } from "@/services/api.service";

export function TasksOverview() {
  // const tasks = [
  //   {
  //     title: "Update landing page",
  //     status: "In Progress",
  //     priority: "High",
  //   },
  //   {
  //     title: "Fix authentication bug",
  //     status: "To Do",
  //     priority: "Urgent",
  //   },
  //   {
  //     title: "Write documentation",
  //     status: "In Review",
  //     priority: "Medium",
  //   },
  // ]

  const [tasks, setTasks] = useState<any>([]);

  const fetchTasks: any = async () => {
    try {
      let response = await recentTasksApi();
      console.log(">>", response);
      setTasks(response);
    } catch (error) {
      console.log("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500/10 text-red-500";
      case "High":
        return "bg-orange-500/10 text-orange-500";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-green-500/10 text-green-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length ? (
          tasks.map((task: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.status}</p>
              </div>
              <Badge
                variant="secondary"
                className={getPriorityColor(task.priority)}
              >
                {task.priority}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            There are no recent tasks
          </p> // Placeholder text when no tasks are found.
        )}
      </CardContent>
    </Card>
  );
}
