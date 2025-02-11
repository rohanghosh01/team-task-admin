"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/auth";
import TableData from "./table-data";
import { Checkbox } from "../ui/checkbox";
import { useDashboard } from "@/contexts/dashboardContext";
import NoRecordsFound from "../no-records-found";
import { MemberTableSkeleton } from "./member-skeleton";

interface TeamMembersTableProps {
  members: User[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
}

export function TeamMembersTable({
  members,
  isFetching,
  isFetchingNextPage,
}: TeamMembersTableProps) {
  const { selectedMembers, setSelectedMembers } = useDashboard();

  // Check if all members are selected
  const allSelected =
    selectedMembers.length === members.length && members.length > 0;

  // Toggle individual member selection
  const toggleMemberSelection = (data: { _id: string }) => {
    setSelectedMembers(
      (prev: { _id: string }[]) =>
        prev.some((member) => member._id === data._id)
          ? prev.filter((member) => member._id !== data._id) // Remove if already selected
          : [...prev, data] // Add if not selected
    );
  };

  // Toggle all members selection
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members);
    }
  };

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="space-y-6">
        <MemberTableSkeleton />
      </div>
    );
  }

  if (!members.length) {
    return <NoRecordsFound />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Password</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <React.Fragment key={index}>
              <TableData
                member={member}
                selectedMembers={selectedMembers}
                toggleMemberSelection={toggleMemberSelection}
              />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
