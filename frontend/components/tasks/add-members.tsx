import * as React from "react";
import { Check, Loader, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { addProjectMemberApi, memberList } from "@/services/api.service";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { User as Member } from "@/types/auth";
import { useDebounce } from "use-debounce";
import { useRootContext } from "@/contexts/RootContext";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function AddMembersDialog({
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
  const [loading, setLoading] = React.useState(false);
  const { setShowMessage } = useRootContext();

  const fetchMembers = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
        search: debouncedSearch,
      };
      const { users, nextOffset } = await memberList(query);
      return { data: users, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const toggleMember = (member: Member) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m._id === member._id)
        ? prev.filter((m) => m._id !== member._id)
        : [...prev, member]
    );
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["members-list", debouncedSearch], // Include debounced search in the query key
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = selectedMembers.map((member) => member._id);
      await addProjectMemberApi(projectId, data);
      setShowMessage({
        message: "Members added successfully!",
        type: "success",
      });
      setLoading(false);
      setOpen(false);
    } catch (error: any) {
      setLoading(false);

      setShowMessage({
        message: error?.message || "Failed to add members",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        queryClient.clear();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Select members to add to your project. Click the member name to
            select or deselect.
          </DialogDescription>
        </DialogHeader>

        <Command className="rounded-lg border shadow-md">
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

          <CommandGroup className="h-40 overflow-y-auto">
            {isFetching && !members.length && (
              <div className="flex w-full items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            )}
            {members.map((member, index) => (
              <CommandItem
                key={index}
                onSelect={() => toggleMember(member)}
                className="cursor-pointer"
              >
                <div className="flex gap-2 items-center group w-full">
                  <Avatar>
                    <AvatarFallback className="bg-foreground/10">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span> {member.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {member.email}
                    </span>
                  </div>
                </div>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedMembers.some((m) => m._id === member._id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
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
        <div className="flex flex-wrap gap-2 py-4">
          {selectedMembers?.length
            ? selectedMembers.map((member) => (
                <Badge key={member._id} variant="secondary" className="gap-1">
                  {member.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleMember(member)}
                  />
                </Badge>
              ))
            : null}
        </div>
        <DialogFooter>
          {loading ? (
            <Button className="mt-4" disabled={true}>
              Adding members...
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="mt-4"
              disabled={!selectedMembers.length}
            >
              Add Selected Members
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
