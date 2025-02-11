import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/contexts/dashboardContext";
import { PageQuery } from "@/types/page";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function PaginationComponent({
  totalRecords,
  queryFun,
}: {
  totalRecords: number; // The total number of records to paginate through
  queryFun: (query: PageQuery) => any; // The function to execute when the page is changed
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters only once
  const pageSize = useMemo(
    () => parseInt(searchParams.get("pageSize") || "10", 10),
    [searchParams]
  );
  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const status = useMemo(
    () => searchParams.get("status") || "all",
    [searchParams]
  );
  const role = useMemo(() => searchParams.get("role") || "all", [searchParams]);
  const { setSearch, search, members } = useDashboard();

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePageSizeChange = (newPageSize: string) => {
    router.push(
      `?page=1&pageSize=${newPageSize}&search=${search}&role=${role}&status=${status}`
    );
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      `?page=${newPage}&pageSize=${pageSize}&search=${search}&role=${role}&status=${status}`
    );
  };

  useEffect(() => {
    const param: PageQuery = {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: search || undefined,
      status: status !== "all" ? status : "all",
      role: role !== "all" ? role : undefined,
    };
    queryFun(param);
    console.log(">>");
  }, [pageSize, currentPage, search, status, role]);

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(
        `?page=${currentPage}&pageSize=${pageSize}&search=${search.trim()}&role=${role}&status=${status}`
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [search, currentPage, pageSize, role, status, router]);

  if (!members.length) {
    return null;
  }

  return (
    <div className="flex justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page</span>
        <Select onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 2 && totalPages > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {currentPage > 1 && currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage);
                  }}
                  isActive={true}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 1 && totalPages > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
