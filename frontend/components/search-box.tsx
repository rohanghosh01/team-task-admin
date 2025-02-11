"use client";

import { NextPage } from "next";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { PageQuery } from "@/types/page";
import { useDashboard } from "@/contexts/dashboardContext";

interface Props {
  placeholder: string;
  className?: string;
  search: string;
  setSearch: (value: string) => void;
}

const SearchBox: NextPage<Props> = ({
  placeholder,
  className,
  search,
  setSearch,
}) => {
  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-[15rem] items-center space-x-2 relative",
        className
      )}
    >
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pr-10"
      />
      {search ? (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 rounded-r-md rounded-l-none"
          onClick={() => setSearch("")}
        >
          <X />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 rounded-r-md rounded-l-none mr-10"
        >
          <Search />
        </Button>
      )}
    </div>
  );
};

export default SearchBox;
