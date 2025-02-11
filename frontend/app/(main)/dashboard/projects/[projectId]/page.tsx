"use client";

import React, { Suspense, useEffect, useState } from "react";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskHeader } from "@/components/tasks/task-header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useTask } from "@/contexts/taskContext";
import { TaskListApi, updateTaskApi } from "@/services/api.service";
import { useDebounce } from "use-debounce";
import { useDashboard } from "@/contexts/dashboardContext";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/task";
import { useRootContext } from "@/contexts/RootContext";
import { Grid, List } from "lucide-react";
import { TaskList } from "@/components/tasks/task-list";

export default function ProjectTasksPage({ params }: any) {
  const { projectId }: any = React.use(params);
  const { setNewTask, newTask } = useTask();
  const [counts, setCounts] = useState({
    todo: 0,
    in_progress: 0,
    in_review: 0,
    done: 0,
  });
  const { filters } = useDashboard();
  const [debouncedFilters] = useDebounce(filters, 300);
  const { setShowMessage } = useRootContext();
  const [isListView, setIsListView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tasksList, setTasksList] = useState<any[]>([]);

  const fetchTasks = async ({ pageParam = 0, status }: any) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
        status,
        ...debouncedFilters,
      };
      const { tasks, nextOffset, totalCount, type } = await TaskListApi(
        projectId,
        query
      );
      setCounts((prev) => ({ ...prev, [type]: totalCount }));
      return { data: tasks, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { ref, inView } = useInView();
  const [tasksByStatus, setTasksByStatus] = useState<{
    [key in TaskStatus]: Task[];
  }>({
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  });

  const createQueryForStatus = (status: TaskStatus) =>
    useInfiniteQuery({
      queryKey: ["tasks", debouncedFilters, status],
      queryFn: (context) => fetchTasks({ ...context, status }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  const queries = {
    todo: createQueryForStatus("todo"),
    in_progress: createQueryForStatus("in_progress"),
    in_review: createQueryForStatus("in_review"),
    done: createQueryForStatus("done"),
  };

  useEffect(() => {
    Object.entries(queries).forEach(([status, query]) => {
      const { data } = query;
      if (data) {
        setTasksByStatus((prev) => ({
          ...prev,
          [status]: data.pages.flatMap((page) => page.data),
        }));
      }
    });
  }, [
    queries.todo.data,
    queries.in_progress.data,
    queries.in_review.data,
    queries.done.data,
  ]);

  useEffect(() => {
    if (inView) {
      Object.values(queries).forEach(({ fetchNextPage }) => fetchNextPage());
    }
  }, [inView]);

  const handleUpdateTask = async (task: Task, sourceStatus: TaskStatus) => {
    try {
      const updateTaskStatus = { ...task, status: task.status };
      setTasksByStatus((prev) => {
        const updatedSource = prev[sourceStatus].filter(
          (t) => t._id !== task._id
        );
        const updatedDestination = [...prev[task.status], updateTaskStatus];
        return {
          ...prev,
          [sourceStatus]: updatedSource,
          [task.status]: updatedDestination,
        };
      });
      await updateTaskApi(task._id, { status: task.status });
      setShowMessage({
        message: "Task status updated successfully",
        type: "success",
      });
    } catch {
      setShowMessage({ message: "Error updating task status", type: "error" });
    }
  };

  useEffect(() => {
    if (newTask) {
      Object.values(queries).forEach(({ refetch }) => refetch());
      setNewTask(false);
    }
  }, [newTask]);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768; // Adjust breakpoint if needed
      setIsMobile(mobileView);

      // Force list view if in mobile viewport
      if (mobileView) {
        setIsListView(true);
      }
    };

    // Set initial state
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
    <div className="space-y-6">
      <TaskHeader
        projectId={projectId}
        counts={counts}
        isListView={isListView}
      />
      {!isMobile && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsListView(!isListView)}
            className="flex items-center gap-2 px-4 py-2 border rounded"
          >
            {isListView ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
            {isListView ? "Grid View" : "List View"}
          </button>
        </div>
      )}

      {isListView ? (
        <TaskList projectId={projectId} />
      ) : (
        <TaskBoard
          tasksByStatus={tasksByStatus}
          setTasksByStatus={setTasksByStatus}
          counts={counts}
          onTaskUpdate={handleUpdateTask}
          setCounts={setCounts}
          isLoading={{
            todo: queries.todo.isFetching,
            in_progress: queries.in_progress.isFetching,
            in_review: queries.in_review.isFetching,
            done: queries.done.isFetching,
          }}
          onLoadMore={(status) => queries[status].fetchNextPage()}
          hasMore={{
            todo: queries.todo.hasNextPage,
            in_progress: queries.in_progress.hasNextPage,
            in_review: queries.in_review.hasNextPage,
            done: queries.done.hasNextPage,
          }}
        />
      )}

      {!isListView && (
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(queries).map(([status, query]) => (
            <React.Fragment key={status}>
              {query.hasNextPage && (
                <Button
                  variant="outline"
                  ref={ref}
                  onClick={query.fetchNextPage as any}
                  disabled={!query.hasNextPage || query.isFetchingNextPage}
                >
                  {query.isFetchingNextPage
                    ? `Loading ${status}...`
                    : `Load More ${status}`}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
    </Suspense>
  );
}
