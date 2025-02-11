"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/auth";

type DashboardContextType = {
  members: User[];
  addMemberData: (member: User) => void;
  updateMemberData: (id: string, updatedMember: Partial<User>) => void;
  deleteMemberData: (id: string) => void;
  setMembers: (members: User[]) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedMembers: any[];
  setSelectedMembers: (data: any) => void;
  deleteBulkMemberData: (member: string[]) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  isApplied: boolean;
  setIsApplied: (value: boolean) => void;
  filterData: any;
  setFilterData: (data: any) => void;
};

const DashboardContext = createContext<DashboardContextType>({
  members: [],
  addMemberData: () => {},
  updateMemberData: () => {},
  deleteMemberData: () => {},
  setMembers: () => {},
  search: "",
  setSearch: () => {},
  selectedMembers: [],
  setSelectedMembers: () => {},
  deleteBulkMemberData: () => {},
  filters: {},
  setFilters: () => {},
  isApplied: false,
  setIsApplied: () => {},
  filterData: null,
  setFilterData: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const [isApplied, setIsApplied] = useState(false);
  const [filterData, setFilterData] = useState(null);

  // Function to add a new member
  const addMemberData = (member: User) => {
    setMembers((prevMembers) => [member, ...prevMembers]);
  };

  // Function to update an existing member
  const updateMemberData = (id: string, updatedMember: Partial<User>) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member._id === id ? { ...member, ...updatedMember } : member
      )
    );
  };

  // Function to delete a member
  const deleteMemberData = (id: string) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member._id !== id)
    );
  };
  const deleteBulkMemberData = (data: any[]) => {
    // Extract all _id values from the array of objects
    const idsToDelete = data.map((item) => item._id);

    setMembers((prevMembers) =>
      prevMembers.filter((member) => !idsToDelete.includes(member._id))
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        members,
        addMemberData,
        updateMemberData,
        deleteMemberData,
        setMembers,
        search,
        setSearch,
        selectedMembers,
        setSelectedMembers,
        deleteBulkMemberData,
        filters,
        setFilters,
        isApplied,
        setIsApplied,
        filterData,
        setFilterData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
