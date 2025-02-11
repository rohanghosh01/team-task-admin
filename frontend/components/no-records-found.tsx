"use client";

import { TableProperties } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/dashboardContext";
import { useProject } from "@/contexts/projectContext";

interface NoRecordsFoundProps {
  title?: string;
}

export default function NoRecordsFound({
  title = "No records found",
}: NoRecordsFoundProps) {
  const router = useRouter();
  const { setSearch, setFilters } = useDashboard();
  const { setSearch: setProjectSearch } = useProject();

  const removeQueryFromUrl = () => {
    setFilters({});
    setSearch("");
    setProjectSearch("");
    const cleanUrl = window.location.pathname; // Get the clean path from the browser
    console.log(">>cleanUrl", cleanUrl);
    router.push(cleanUrl); // Replace the current URL with the clean one
    router.refresh(); // Refresh the
  };

  return (
    <div className="w-full px-6 py-24 bg-background border rounded-lg shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <TableProperties className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          There are no records to display at the moment. New records will appear
          here when they become available.
        </p>
        <Button onClick={removeQueryFromUrl}>Refresh Data</Button>
      </div>
    </div>
  );
}
