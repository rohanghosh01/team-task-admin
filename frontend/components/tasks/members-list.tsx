import * as React from "react";
import { Copy, Loader, Loader2, Search, UsersIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projectMemberList } from "@/services/api.service";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/auth";
import { useDebounce } from "use-debounce";
import { useRootContext } from "@/contexts/RootContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ToolTipProvider } from "../tooltip-provider";
import { toast } from "sonner";

interface Member {
  _id: string;
  role: string;
  joinedAt: string;
  user: User;
}

export function MembersListDialog({
  open,
  setOpen,
  projectId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
}) {
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 400, { trailing: true });
  const { ref, inView } = useInView();
  const [members, setMembers] = React.useState<Member[]>([]);
  const queryClient = useQueryClient();

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
      queryKey: ["project-members-list", debouncedSearch], // Include debounced search in the query key
      queryFn: fetchMembers,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.info("Email copied");
  };

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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          queryClient.clear();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          Members
          <UsersIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle>Members List</DialogTitle>
        </DialogHeader>

        <Command className="rounded-none border-0 shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={ref}
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

          {!isFetching && <CommandEmpty>No members found.</CommandEmpty>}

          <CommandGroup className="h-80 overflow-y-auto">
            {isFetching && !members.length && (
              <div className="flex w-full items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            )}
            {members.map(({ user }, index) => (
              <CommandItem key={index} className="cursor-pointer">
                <div className="flex gap-2 items-center group w-full">
                  <Avatar>
                    <AvatarFallback className="bg-foreground/10">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span> {user.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.email}
                    </span>
                  </div>
                  <ToolTipProvider name="Copy email">
                    <Copy
                      className="ml-auto w-4 h-4 hidden group-hover:flex"
                      onClick={() => handleCopy(user.email)}
                    />
                  </ToolTipProvider>
                </div>
              </CommandItem>
            ))}
            <div className="flex justify-center h-2">
              {hasNextPage && (
                <Button
                  variant="link"
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
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
