"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";
import { Calendar, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPriorityColor,
  getPriorityIcon,
  getStatusColor,
  projectStatusColor,
} from "@/lib/color-helper";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project?.name}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg capitalize">{project.name}</h3>
            <Badge
              variant="secondary"
              className={cn(
                projectStatusColor(project.status),
                project.status === "active" &&
                  "bg-sky-500/10 text-sky-500 hover:bg-blue-500/20",
                project.status === "hold" &&
                  "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
              )}
            >
              <span className="capitalize">{project.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress?.toFixed(2)}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{project.startDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {project.tasksCount?.completed}/{project.tasksCount?.total}{" "}
                tasks
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex -space-x-2">
            {project?.teamMembers?.map((member, i) => (
              <Avatar key={i} className="border-2 border-background h-8 w-8">
                <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* <Badge
            variant="secondary"
            className={cn(
              getPriorityColor(project.priority),
              "flex gap-2 items-center"
            )}
          >
            <span className="capitalize">{project.priority}</span>
            {getPriorityIcon(project.priority)}
          </Badge> */}
        </CardFooter>
      </Card>
    </Link>
  );
}
