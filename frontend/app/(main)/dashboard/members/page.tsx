"use client";

import { Suspense, useEffect, useState } from "react";
import { TeamMembersHeader } from "@/components/members/team-members-header";
import { TeamMembersTable } from "@/components/members/team-members-table";
import { memberList } from "@/services/api.service";
import { useDashboard } from "@/contexts/dashboardContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";

export default function MembersPage() {
  const { setMembers, members } = useDashboard();
  const [total, setTotal] = useState(0);
  const { filters, setFilters, search } = useDashboard();
  const debounceSearch = useDebounce(search, 600, { trailing: true });

  const fetchMembers = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 10, // Adjust the page size as needed
        search,
        ...filters,
      };
      const { users, totalCount, nextOffset } = await memberList(query);
      setTotal(totalCount);
      return { data: users, nextCursor: nextOffset };
    } catch (error) {
      console.log("Error fetching members:", error);
      return { data: [], nextCursor: null };
    }
  };

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["members", filters, debounceSearch],
      queryFn: fetchMembers,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  // Fetch next page when the ref comes into view
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Sync members data to context
  useEffect(() => {
    if (data) {
      const allMembers = data.pages.flatMap((page) => page.data);
      setMembers(allMembers);
    }
  }, [data, setMembers]);

  useEffect(() => {
    setFilters({});
  }, []);

  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <div className="space-y-6">
        <TeamMembersHeader total={total} />
        <TeamMembersTable
          members={members || []}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        />
        <div className="flex justify-center mt-4">
          {hasNextPage && (
            <button
              ref={ref}
              className="px-4 py-2 border rounded"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "No more members"}
            </button>
          )}
        </div>
      </div>
    </Suspense>
  );
}
