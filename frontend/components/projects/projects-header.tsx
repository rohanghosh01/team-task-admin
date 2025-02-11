"use client";

import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddProjectDialog } from "./add-project-dialog";
import { useAuth } from "@/contexts/authContext";
import { FilterSheet } from "../filter-sheet";
import { FilterConfig } from "@/types/filter";
import SearchBox from "../search-box";
import { useProject } from "@/contexts/projectContext";
import { useDashboard } from "@/contexts/dashboardContext";
import { useRouter } from "next/navigation";

const projectFilterConfig: FilterConfig = {
  title: "Filter Projects",
  description: "Filter projects by their status.",
  fields: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      options: [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
      ],
    },
  ],
};

export function ProjectsHeader({ count }: { count: number }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === "admin";
  const { search, setSearch } = useProject();
  const { setFilters, filters } = useDashboard();
  const router = useRouter();

  const applyFilters = (filters: any) => {
    // Get the existing query parameters from the current URL
    const currentQueryParams = new URLSearchParams(window.location.search);

    // Merge the existing query parameters with the new filters
    const mergedQueryParams = new URLSearchParams(currentQueryParams);

    // Add or update filter-related query parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        mergedQueryParams.set(key, filters[key]);
      } else {
        mergedQueryParams.delete(key); // If no filter is set, remove it from the query string
      }
    });

    // Push the updated query string to the router
    router.push(`?${mergedQueryParams.toString()}`);
  };

  useEffect(() => {
    let filter = {
      search: search,
    };
    setFilters(filter);
    applyFilters(filter);
  }, [search]);

  return (
    <div className="flex items-center justify-between flex-wrap max-md:gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Projects ({count})
        </h1>
        <p className="text-muted-foreground max-md:hidden">
          {isAdmin
            ? "Manage your team projects and track their progress"
            : "View your assigned projects and their progress"}
        </p>
      </div>

      <div className="flex gap-2">
        <SearchBox
          placeholder="Search for project"
          setSearch={setSearch}
          search={search}
        />
        {isAdmin && (
          <>
            <Button onClick={() => setShowAddDialog(true)}>
              <FolderPlus className="md:mr-2 h-4 w-4" />
              <span className="md:flex hidden"> New Project</span>
            </Button>
            <AddProjectDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
            />
          </>
        )}
        <FilterSheet
          config={projectFilterConfig}
          currentFilters={{ status: "all", priority: "all" }}
        />
      </div>
    </div>
  );
}
