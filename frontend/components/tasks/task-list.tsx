import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, TaskStatus } from "@/types/task";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/formatDate";
import { Tag, User2, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getPriorityColor,
  getPriorityIcon,
  getStatusColor,
} from "@/lib/color-helper";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/dashboardContext";
import { useDebounce } from "use-debounce";
import { TaskListApi } from "@/services/api.service";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import TaskTableSkeleton from "./task-list-skeleton";
import NoRecordsFound from "../no-records-found";

interface TaskListProps {
  projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { filters } = useDashboard();
  const [debouncedFilters] = useDebounce(filters, 300);
  const { ref, inView } = useInView();
  const [tasks, setTasks] = useState<Task[]>([]);

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
      return { data: tasks, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["task-list", debouncedFilters], // Include debounced filters in the query key
      queryFn: fetchTasks,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // Sync projects to context whenever `data` changes
  useEffect(() => {
    if (data) {
      const list = data.pages.flatMap((page) => page.data);
      setTasks(list);
    }
  }, [data, setTasks]);

  const onClickRow = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  if (isFetching && !isFetchingNextPage) {
    return <TaskTableSkeleton />;
  }

  if (!tasks.length) {
    return <NoRecordsFound />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task._id}
              onClick={() => onClickRow(task?._id)}
              className="cursor-pointer"
            >
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    getPriorityColor(task.priority),
                    "flex gap-2 items-center w-20"
                  )}
                >
                  <span className="capitalize">{task.priority}</span>
                  {getPriorityIcon(task.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                {" "}
                <Badge
                  variant="secondary"
                  className={cn(
                    getStatusColor(task.status),
                    task.status === "in_progress" &&
                      "bg-sky-500/10 text-sky-500 hover:bg-blue-500/20",
                    task.status === "todo" &&
                      "bg-gray-500/10  hover:bg-gray-500/20"
                  )}
                >
                  <span className="capitalize whitespace-nowrap">
                    {task.status.replace("_", " ")}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>{formatDate(task.createdAt) || "N/A"}</TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {task.assignee ? (
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {task.assignee?.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {task.assignee?.name}
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      Unassigned
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {task?.labels?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.labels.slice(0, 3).map((label) => (
                      <Badge key={label} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {label}
                      </Badge>
                    ))}
                    {task.labels.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500"
                      >
                        +{task.labels.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        {hasNextPage && (
          <Button
            variant="outline"
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        )}
      </div>
    </>
  );
}
