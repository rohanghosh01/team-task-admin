"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardChartDataApi } from "@/services/api.service";
import type { ChartType } from "@/types/project";
import { useEffect, useState } from "react";
import { TaskStatusChart } from "./task-status-chart";
import { TaskPriorityChart } from "./task-priority-chart";

export default function AnalyticsPage() {
  const [data, setData] = useState<ChartType>({
    _id: null,
    projectName: "", // Optional field
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progress: 0,
    totalMembers: 0,
    taskByStatus: {
      todo: 0,
      in_progress: 0,
      in_review: 0,
      done: 0,
    },
    taskByPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    },
  });

  const getData = async () => {
    try {
      const res = await dashboardChartDataApi();
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []); // Added getData to dependencies

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your team's performance and project metrics
        </p>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TaskStatusChart data={data} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Task Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TaskPriorityChart data={data} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {/* Add project-specific charts here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
