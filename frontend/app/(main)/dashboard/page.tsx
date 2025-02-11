"use client";

import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { TeamOverview } from "@/components/dashboard/team-overview";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardStats />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectsOverview />
          <TasksOverview />
          <TeamOverview />
        </div>
        {/* <ActivityFeed /> */}
      </div>
    </Suspense>
  );
}
