"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  ChevronsUpDown,
  Loader,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { labelList } from "@/services/api.service";

const predefinedLabels = ["Important", "Urgent", "Personal", "Work", "Study"];

interface TaskLabelsProps {
  initialLabels?: string[];
  onLabelsChange: (labels: string[]) => void;
}

interface LabelType {
  _id: string;
  name: string;
}

export function TaskLabels({
  initialLabels = [],
  onLabelsChange,
}: TaskLabelsProps) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<string[]>(initialLabels);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedSearch] = useDebounce(inputValue, 400, { trailing: true });
  const [predefinedLabels, setPredefinedLabels] = useState<LabelType[]>([]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const addLabel = (label: string) => {
    if (label && !labels.includes(label)) {
      const updatedLabels = [...labels, label];
      setLabels(updatedLabels);
      onLabelsChange(updatedLabels);
      setInputValue("");
    }
  };

  const removeLabel = (label: string) => {
    const updatedLabels = labels.filter((l) => l !== label);
    setLabels(updatedLabels);
    onLabelsChange(updatedLabels);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue) {
      addLabel(inputValue);
    }
  };

  const fetchLabels = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 8,
        search: debouncedSearch,
      };
      const { results, nextOffset } = await labelList(query);
      return { data: results, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["labels", debouncedSearch], // Include debounced search in the query key
      queryFn: fetchLabels,
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
      setPredefinedLabels(results);
    }
  }, [data]);

  return (
    <div>
      <Label className="text-sm font-medium">Labels</Label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {labels.map((label) => (
          <Badge
            key={label}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => removeLabel(label)}
          >
            {label}
            <span className="ml-1 text-xs">&times;</span>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="w-6 h-6">
              <Plus className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput
                placeholder="Search or add label..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              /> */}

              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={inputRef}
                  className={cn(
                    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-0 ring-0 focus:ring-0"
                  )}
                  placeholder="Search or add label..."
                  value={inputValue}
                  onChange={(e: any) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {inputValue && !isFetching && (
                  <X
                    className="cursor-pointer"
                    onClick={() => setInputValue("")}
                  />
                )}
                {inputValue && isFetching && (
                  <Loader2 className="animate-spin" />
                )}
              </div>
              {!isFetching && (
                <CommandEmpty>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => addLabel(inputValue)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{inputValue}"
                  </Button>
                </CommandEmpty>
              )}

              <CommandGroup className="h-60 overflow-y-auto">
                {isFetching && !predefinedLabels.length && (
                  <div className="flex w-full items-center justify-center">
                    <Loader className="animate-spin" />
                  </div>
                )}
                {predefinedLabels.map((label) => (
                  <CommandItem
                    key={label?._id}
                    onSelect={() => {
                      addLabel(label?.name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        labels.includes(label?.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {label?.name}
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
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
