import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import NoRecordsFound from "../no-records-found";
import ProjectSkeleton from "./project-skeleton";

interface ProjectsGridProps {
  projects: Project[];
  isFetching?: boolean;
}

export function ProjectsGrid({ projects, isFetching }: ProjectsGridProps) {
  if (!projects?.length && !isFetching) {
    return <NoRecordsFound />;
  }

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project?._id} project={project} />
      ))}
    </div>
  );
}
