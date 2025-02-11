"use client";
import Papa from "papaparse"; // CSV parsing library
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddMemberDialog } from "./add-member-dialog";
import { useState } from "react";
import SearchBox from "../search-box";
import { PageQuery } from "@/types/page";
import { AddMemberCsvDialog } from "./add-member-csv";
import { useDashboard } from "@/contexts/dashboardContext";
import AlertBox from "../alert-box";
import { useRootContext } from "@/contexts/RootContext";
import { deleteMember } from "@/services/api.service";
import { FilterSheet } from "../filter-sheet";
import { FilterConfig } from "@/types/filter";
import { cn } from "@/lib/utils";

const memberFilterConfig: FilterConfig = {
  title: "Filter Members",
  description: "Filter members by their status and role.",
  fields: [
    {
      id: "status",
      label: "Status",
      type: "select", // Explicitly specifying the literal type "select"
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      id: "role",
      label: "Role",
      type: "select", // Explicitly specifying the literal type "select"
      options: [
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
      ],
    },
  ],
};

export function TeamMembersHeader({ total }: { total: number }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddDialogCsv, setShowAddDialogCsv] = useState(false);
  const [removeDialog, setRemoveDialog] = useState(false);
  const { selectedMembers, deleteBulkMemberData, setSearch, search } =
    useDashboard();
  const { setLoading, setShowMessage } = useRootContext();

  const handleRemove = async () => {
    try {
      setLoading(true);
      let ids: any = [];
      selectedMembers.forEach((member: any) => ids.push(member._id));
      ids = ids.join(",");
      const res = await deleteMember(ids);
      deleteBulkMemberData(selectedMembers);
      setShowMessage({
        message: "Member removed successfully!",
        type: "success",
      });
      setLoading(false);
    } catch (error: any) {
      console.log("Failed to remove member:", error);
      setShowMessage({
        message: error?.message || "Failed to remove member",
        type: "error",
      });
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    // Prepare the filtered data
    const filteredData = selectedMembers.map((member) => ({
      Name: member.name,
      Email: member.email,
      Role: member.role,
    }));

    // Convert to CSV using Papa.unparse with options
    const csv = Papa.unparse(filteredData, {
      quotes: true, // Add quotes around values
      quoteChar: '"', // Specify the quote character
      escapeChar: '"', // Escape special characters
      delimiter: ",", // Ensure proper CSV delimiter
      header: true, // Include headers
    });

    // Create a Blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Date.now()}-members.csv`;
    link.click();
  };

  return (
    <div className="flex items-center justify-between flex-wrap max-md:gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Team Members ({total})
        </h1>
        <p className="text-muted-foreground max-md:hidden">
          Manage your team members and their access levels
        </p>
      </div>

      <div
        className={cn(
          "flex gap-3 items-center",
          selectedMembers?.length ? "max-sm:flex-col" : ""
        )}
      >
        {selectedMembers?.length ? (
          <div className="flex items-center gap-2 ">
            <span className="whitespace-nowrap">
              {selectedMembers?.length} row(s) selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Bulk operation</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => downloadCsv()}
                  className="cursor-pointer"
                >
                  Export csv
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setRemoveDialog(true)}
                >
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}

        <div className="flex gap-2">
          <SearchBox
            placeholder="Search members..."
            search={search}
            setSearch={setSearch}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <UserPlus className="md:mr-2  h-4 w-4" />
                <span className="md:flex hidden"> Add Member</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setShowAddDialog(true)}
                className="cursor-pointer"
              >
                Upload one by one
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowAddDialogCsv(true)}
              >
                Upload csv
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FilterSheet
            config={memberFilterConfig}
            currentFilters={{ status: "active", role: "member" }}
          />
        </div>
      </div>

      {showAddDialog && (
        <AddMemberDialog open={showAddDialog} onChange={setShowAddDialog} />
      )}
      {showAddDialogCsv && (
        <AddMemberCsvDialog
          open={showAddDialogCsv}
          onOpenChange={setShowAddDialogCsv}
        />
      )}

      <AlertBox
        message={
          <span className="whitespace-wrap">
            Are you sure you want to remove all {selectedMembers?.length}{" "}
            members? This action cannot be undone.
          </span>
        }
        open={removeDialog}
        onOpenChange={setRemoveDialog}
        onConfirm={() => {
          handleRemove();
        }}
      />
    </div>
  );
}
