"use client";

import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { projectList } from "@/services/api.service";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/projectContext";
import { useDashboard } from "@/contexts/dashboardContext";
import { useRootContext } from "@/contexts/RootContext";
import { useDebounce } from "use-debounce";

export default function ProjectsPage() {
  const { setProjects, projects } = useProject();
  const { filters } = useDashboard();
  const [count, setCount] = useState(0);
  const [debouncedFilters] = useDebounce(filters, 300);

  const fetchProjects = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
        ...debouncedFilters, // Include the debounced filters in the query
      };
      const { projects, nextOffset, totalCount } = await projectList(query);
      setCount(totalCount);
      return { data: projects, nextCursor: nextOffset };
    } catch (error) {
      setCount(0);
      return { data: [], nextCursor: null };
    }
  };

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["projects", debouncedFilters], // Include debounced filters in the query key
      queryFn: fetchProjects,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // Sync projects to context whenever `data` changes
  useEffect(() => {
    if (data) {
      const allProjects = data.pages.flatMap((page) => page.data);
      setProjects(allProjects);
    }
  }, [data, setProjects]);

  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <div className="space-y-6">
        <ProjectsHeader count={count} />
        <>
          <ProjectsGrid projects={projects || []} isFetching={isFetching} />
          <div className="flex justify-center mt-4">
            {hasNextPage && (
              <Button
                variant="outline"
                ref={ref}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </Button>
            )}
          </div>
        </>
      </div>
    </Suspense>
  );
}
