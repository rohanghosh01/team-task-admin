"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddTaskDialog } from "./add-task-dialog";
import { useAuth } from "@/contexts/authContext";
import { useDashboard } from "@/contexts/dashboardContext";
import { useRouter } from "next/navigation";
import SearchBox from "../search-box";
import { useTask } from "@/contexts/taskContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AddMembersDialog } from "./add-members";
import { FilterSheet } from "../filter-sheet";
import { FilterConfig } from "@/types/filter";
import { countType } from "@/types/task";
import { MembersListDialog } from "./members-list";
import FilterChips from "../filter-chips";

interface TaskHeaderProps {
  projectId: string;
  counts: countType;
  isListView: boolean;
}

export function TaskHeader({ projectId, counts, isListView }: TaskHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === "admin";
  const { setFilters, filters } = useDashboard();
  const { search, setSearch, addTask } = useTask();
  const router = useRouter();

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    title: "Filter Projects",
    description: "Filter projects by their status.",
    fields: [
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
  });

  const totalCount = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );

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
  }, [search, setSearch]);

  useEffect(() => {
    setFilters({});
    if (isListView) {
      setFilterConfig({
        title: "Filter Tasks",
        description: "Filter tasks by their status.",
        fields: [
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
          {
            id: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "todo", label: "To Do" },
              { value: "in_progress", label: "In progress" },
              { value: "in_review", label: "In Review" },
              { value: "done", label: "Done" },
            ],
          },
        ],
      });
    } else {
      setFilterConfig({
        title: "Filter Tasks",
        description: "Filter tasks by their status.",
        fields: [
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
      });
    }
  }, [isListView]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tasks ({totalCount})
        </h1>
        <p className="text-muted-foreground max-md:hidden">
          Manage and track project tasks
        </p>
      </div>
      <div className="flex gap-3">
        <SearchBox
          placeholder="Search for Task"
          setSearch={setSearch}
          search={search}
        />
        {isAdmin && (
          <>
            <MembersListDialog
              open={isMember}
              setOpen={setIsMember}
              projectId={projectId}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4" />
                  <span className="max-md:hidden">Create</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setShowAddDialog(true);
                  }}
                >
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setAddMember(true);
                  }}
                >
                  <span className="">Add Member</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {/* <FilterChips /> */}
        <FilterSheet
          config={filterConfig}
          currentFilters={{ status: "all", priority: "all" }}
        />
      </div>

      <AddTaskDialog
        projectId={projectId}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
      {addMember && (
        <AddMembersDialog
          open={addMember}
          setOpen={setAddMember}
          projectId={projectId}
        />
      )}
    </div>
  );
}
