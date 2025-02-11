"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRootContext } from "@/contexts/RootContext";
import { dashboardOverview } from "@/services/api.service";
import { Users, FolderKanban, List } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import DashboardSkeleton from "./DashboardSkeleton";

export function DashboardStats() {
  const [loading, setLoading] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    members: { total: 0, active: 0, inactive: 0 },
    projects: { total: 0, active: 0, completed: 0 },
    tasks: { total: 0, todo: 0, progress: 0, review: 0, done: 0 },
  });

  const stats = [
    {
      title: "Members",
      icon: Users,
      color: "text-blue-500",
      details: [
        {
          label: "Total",
          value: dashboardStats.members.total,
          color: "text-primary",
        },
        {
          label: "Active",
          value: dashboardStats.members.active,
          color: "text-green-500",
        },
        {
          label: "Inactive",
          value: dashboardStats.members.inactive,
          color: "text-red-500",
        },
      ],
    },
    {
      title: "Projects",
      icon: FolderKanban,
      color: "text-green-500",
      details: [
        {
          label: "Total",
          value: dashboardStats.projects.total,
          color: "text-primary",
        },
        {
          label: "Active",
          value: dashboardStats.projects.active,
          color: "text-blue-500",
        },
        {
          label: "Completed",
          value: dashboardStats.projects.completed,
          color: "text-purple-500",
        },
      ],
    },
    {
      title: "Tasks",
      icon: List,
      color: "text-purple-500",
      details: [
        {
          label: "Total",
          value: dashboardStats.tasks.total,
          color: "text-primary",
        },
        {
          label: "To-do",
          value: dashboardStats.tasks.todo,
          color: "text-yellow-500",
        },
        {
          label: "In Progress",
          value: dashboardStats.tasks.progress,
          color: "text-blue-500",
        },
        {
          label: "Under Review",
          value: dashboardStats.tasks.review,
          color: "text-orange-500",
        },
        {
          label: "Done",
          value: dashboardStats.tasks.done,
          color: "text-green-500",
        },
      ],
    },
  ];

  const getDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardOverview();
      if (res) {
        setDashboardStats(res);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Failed to get dashboard stats:", error);
      // Handle error accordingly
    }
  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {stat.details.map((detail) => (
                <li
                  key={detail.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm font-medium">{detail.label}:</span>
                  <span className={`text-sm font-bold ${detail.color}`}>
                    {detail.value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
