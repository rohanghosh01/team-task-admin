"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projectOverviewApi } from "@/services/api.service";
import { use, useEffect, useState } from "react";

export function ProjectsOverview() {
  // const projects = [
  //   {
  //     name: "Website Redesign",
  //     progress: 75,
  //   },
  //   {
  //     name: "Mobile App",
  //     progress: 45,
  //   },
  //   {
  //     name: "API Integration",
  //     progress: 90,
  //   },
  // ];

  const [projects, setProjects] = useState<any>([]);

  const fetchProjects: any = async () => {
    try {
      let response = await projectOverviewApi();
      setProjects(response);
    } catch (error) {
      console.log("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects?.length ? (
          projects?.map((project: any) => (
            <div key={project.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{project.name}</span>
                <span className="text-muted-foreground">
                  {project.progress?.toFixed(2)}%
                </span>
              </div>
              <Progress value={project.progress} />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">There are no projects</p> // Placeholder text when no projects are found.
        )}
      </CardContent>
    </Card>
  );
}
