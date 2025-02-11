"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Project } from "@/types/project";

type ProjectContextType = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setProjects: (projects: Project[]) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedProjects: any[];
  setSelectedProjects: (data: any) => void;
  deleteBulkProjectData: (projectIds: string[]) => void;
};

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  setProjects: () => {},
  search: "",
  setSearch: () => {},
  selectedProjects: [],
  setSelectedProjects: () => {},
  deleteBulkProjectData: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);

  // Function to add a new project
  const addProject = (project: Project) => {
    setProjects((prevProjects) => [project, ...prevProjects]);
  };

  // Function to update an existing project
  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === id ? { ...project, ...updatedProject } : project
      )
    );
  };

  // Function to delete a project
  const deleteProject = (id: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project._id !== id)
    );
  };

  // Function to delete multiple projects
  const deleteBulkProjectData = (projectIds: string[]) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => !projectIds.includes(project._id))
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        setProjects,
        search,
        setSearch,
        selectedProjects,
        setSelectedProjects,
        deleteBulkProjectData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
