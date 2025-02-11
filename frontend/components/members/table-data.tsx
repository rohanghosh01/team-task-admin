"use client";
import { NextPage } from "next";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  CaravanIcon,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Trash,
  UserPen,
} from "lucide-react";
import { User } from "@/types/auth";
import { formatDate } from "@/lib/formatDate";
import {
  deleteMember,
  showMemberPassword,
  updateMember,
} from "@/services/api.service";
import React, { useState } from "react";
import { ToolTipProvider } from "../tooltip-provider";
import { useRootContext } from "@/contexts/RootContext";
import AlertBox from "../alert-box";
import EditMember from "./edit-member";
import { useDashboard } from "@/contexts/dashboardContext";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  member: User;
  selectedMembers: any[];
  toggleMemberSelection: (data: any) => void;
}

const TableData: NextPage<Props> = ({
  member,
  selectedMembers,
  toggleMemberSelection,
}) => {
  const [revealPass, setRevealPass] = useState<any | null>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"active" | "inactive">(member?.status);
  const { setLoading, setShowMessage } = useRootContext();
  const { deleteMemberData } = useDashboard();
  const showPassword = async (id: string, isCopy = false) => {
    try {
      const response = await showMemberPassword(id);
      const pass = response?.decryptedPassword;
      if (!isCopy) setRevealPass({ pass, id });

      return pass;
    } catch (error) {
      console.log("showMemberPassword retrieval failed:", error);
    }
  };
  const copyCredentials = async (data: User) => {
    if (!data) return;
    const { email, _id } = data;
    // In a real app, this would fetch or generate credentials
    const Password = await showPassword(_id, true);
    navigator.clipboard?.writeText(`email: ${email}\nPassword: ${Password}`);
    setShowMessage({
      message: "Credentials copied to clipboard!",
      type: "success",
    });
  };
  const copyData = async (value: string) => {
    if (!value) return;

    navigator.clipboard?.writeText(value);
    setShowMessage({
      message: "Copied to clipboard!",
      type: "success",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      const id = member._id;
      const res = await deleteMember(id);
      deleteMemberData(id);
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

  const checkSelected = !!selectedMembers?.find(
    (m: any) => m?._id == member?._id
  );

  const handleStatusChange = async (value: "active" | "inactive") => {
    setStatus(value);
    try {
      const res = await updateMember(member?._id, { status: value });
      setShowMessage({
        message: "Member status updated successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.log("Failed to update member status:", error);
      setShowMessage({
        message: error?.message || "Failed to update member status",
        type: "error",
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <Checkbox
            checked={checkSelected}
            onCheckedChange={() => toggleMemberSelection(member)}
          />
        </TableCell>
        <TableCell className="font-medium">{member.name}</TableCell>
        <TableCell>
          <div
            className="cursor-pointer"
            onClick={() => copyData(member?.email)}
          >
            <ToolTipProvider name="Copy email" side="right">
              <span>{member?.email}</span>
            </ToolTipProvider>
          </div>
        </TableCell>
        <TableCell>{member?.role}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="secondary"
                className={cn(
                  getStatusColor(status as string),
                  "cursor-pointer"
                )}
              >
                {status}
                <ChevronDown className="h-4 w-4" />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem
                checked={status === "active"}
                onCheckedChange={() => handleStatusChange("active")}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={status === "inactive"}
                onCheckedChange={() => handleStatusChange("inactive")}
              >
                Inactive
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        <TableCell>{formatDate(member?.createdAt as string)}</TableCell>
        <TableCell>
          <div className="p-0">
            {revealPass && revealPass.id === member?._id ? (
              <div className="flex flex-col gap-3 p-0">
                <ToolTipProvider name="copy" side="top">
                  <div
                    className="flex items-center group cursor-pointer"
                    onClick={() => copyData(revealPass.pass)}
                  >
                    <span className="ml-0 p-0 rounded-md bg-muted border">
                      {revealPass.pass}
                    </span>
                  </div>
                </ToolTipProvider>

                <Button
                  className="h-5 w-fit p-1"
                  onClick={() => setRevealPass(null)}
                >
                  Hide password
                </Button>
              </div>
            ) : (
              <Button
                className="h-5 p-1"
                onClick={() => showPassword(member?._id)}
              >
                Reveal password
              </Button>
            )}
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => copyCredentials(member)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Credentials
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <UserPen className="mr-2 h-4 w-4" />
                Edit Member
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setAlertOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <AlertBox
        message={
          <span className="whitespace-wrap">
            Are you sure you want to remove{" "}
            <span className="font-bold text-primary">{member.email}</span> from
            the team? This action cannot be undone.
          </span>
        }
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onConfirm={() => {
          handleRemove();
        }}
      />

      <EditMember open={editOpen} onOpenChange={setEditOpen} member={member} />
    </>
  );
};

export default TableData;
