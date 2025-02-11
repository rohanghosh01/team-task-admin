"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FilterConfig } from "@/types/filter";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolTipProvider } from "./tooltip-provider";
import { Filter } from "lucide-react";
import { useDashboard } from "@/contexts/dashboardContext";
import { mergeQuery } from "@/lib/merge-query";

type FilterSheetProps = {
  config: FilterConfig;
  currentFilters: Record<string, string>; // Existing filters (e.g., { status: "active", role: "admin" })
};

export function FilterSheet({ config, currentFilters }: FilterSheetProps) {
  const { filters, setFilters, filterData, setFilterData } = useDashboard();
  const router = useRouter();

  // Get current query parameters from the URL
  useEffect(() => {
    setFilters(currentFilters);
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};

    // Populate params with existing query parameters
    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    // Update state with existing filters
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...params,
    }));
  }, []);

  const handleFilterChange = (id: string, value: string) => {
    setFilterData((prevFilters: any) => ({ ...prevFilters, [id]: value }));
    // setFilters((prevFilters: any) => ({ ...prevFilters, [id]: value }));
  };

  const applyFilters = () => {
    setFilters(filterData);
    const getFilters = mergeQuery(filters);

    // Push the updated query string to the router
    router.push(`?${getFilters.toString()}`);
  };

  const resetFilters = () => {
    setFilters({});
    // Reset all filters to their default state (empty or no filters)
    setFilterData({});
    router.push(window.location.pathname); // Reset URL by removing the query string
  };

  return (
    <Sheet>
      <ToolTipProvider name="Apply Filter" side="top">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </SheetTrigger>
      </ToolTipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{config.title}</SheetTitle>
          <SheetDescription>{config.description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {config.fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              <Select
                value={filterData?.[field.id] || ""}
                onValueChange={(value) => handleFilterChange(field.id, value)}
              >
                <SelectTrigger className="w-[250px] max-sm:w-[180px]">
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {/* Adding "All" as a valid item that maps to an empty value */}
                  <SelectItem key={`all-${field.id}`} value="all">
                    All {field.label}
                  </SelectItem>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <SheetFooter>
          <div className="flex gap-2 w-full">
            <SheetClose asChild>
              <Button
                type="button"
                onClick={applyFilters}
                className="max-sm:w-fit flex-1"
              >
                Apply Filters
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="max-sm:w-fit"
              >
                Reset Filters
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
