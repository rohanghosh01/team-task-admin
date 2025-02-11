import * as React from "react";
import { Loader2, Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { projectMemberList, updateTaskApi } from "@/services/api.service"; // Assuming this is your API service
import { Input } from "../ui/input";
import { useInView } from "react-intersection-observer";
import { User } from "@/types/auth";
import { useDebounce } from "use-debounce";
import { Task } from "@/types/task";
import { useRootContext } from "@/contexts/RootContext";

interface Member {
  _id: string;
  role: string;
  joinedAt: string;
  user: User;
}

interface ChangeAssigneeProps {
  projectId: string; // Project ID to fetch members
  task: Task | any; // TaskId ID to fetch members
}

export function ChangeAssignee({ projectId, task }: ChangeAssigneeProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 400, { trailing: true });
  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [selectedAssignee, setSelectedAssignee] = React.useState<User | null>(
    null
  );
  const { ref, inView } = useInView();
  const { setShowMessage } = useRootContext();

  // Fetch members with infinite scroll and debounced search
  const fetchMembers = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
        search: debouncedSearch,
        projectId,
      };
      const { results, nextOffset } = await projectMemberList(query);
      return { data: results, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["change-members-list", debouncedSearch], // Include debounced search in the query key
      queryFn: fetchMembers,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  React.useEffect(() => {
    if (data) {
      const results = data.pages.flatMap((page) => page.data);
      setMembers(results);
    }
  }, [data]);

  const handleSelectAssignee = async (user: User | null) => {
    console.log(">user>", user);
    try {
      setSelectedAssignee(user); // Update the assignee
      setOpen(false); // Close the popover
      await updateTaskApi(task?._id, {
        assignee: user?._id, // Update the assignee ID in the task
      });
      setShowMessage({
        message: "Assignee updated successfully!",
        type: "success",
      });
    } catch (error) {
      setShowMessage({
        message: "Error selecting assignee",
        type: "error",
      });
      console.log("Error selecting assignee:", error);
    }
  };

  React.useEffect(() => {
    if (task) {
      setSelectedAssignee(task.assignee); // Set the assignee when the task is updated
    }
  }, [task]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAssignee?.name || "Unassigned"}

          <ChevronDown className="opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-0 ring-0 focus:ring-0"
              )}
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            {searchTerm && !isFetching && (
              <X className="cursor-pointer" onClick={() => setSearchTerm("")} />
            )}
            {searchTerm && isFetching && <Loader2 className="animate-spin" />}
          </div>

          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {isFetching && (
                <div className="flex w-full items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              {members.map(({ user }, index) => (
                <CommandItem
                  key={index}
                  value={user?._id}
                  onSelect={() => handleSelectAssignee(user)}
                >
                  {user.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedAssignee?._id === user?._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <div className="flex justify-center h-2">
              {hasNextPage && (
                <Button
                  ref={ref}
                  variant="link"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More"}
                </Button>
              )}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
