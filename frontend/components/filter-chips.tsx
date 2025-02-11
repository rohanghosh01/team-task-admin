"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"; // Replace with the correct path for your Badge component
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDashboard } from "@/contexts/dashboardContext";

const FilterChips = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  //   const [filters, setFilters] = useState<Record<string, string>>({});
  const { setFilters, filters, setFilterData } = useDashboard();

  // Remove a filter from the URL and state
  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    console.log(">>", params);
    setFilters(params); //
    setFilterData(params); //
    router.push(`?${params.toString()}`); // Update the URL without the removed filter
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(filters).map(([key, value]) => (
        <Badge
          key={key}
          className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800"
        >
          {key}: {value}
          <X
            className="cursor-pointer text-red-500"
            size={16}
            onClick={() => removeFilter(key)}
          />
        </Badge>
      ))}
    </div>
  );
};

export default FilterChips;
