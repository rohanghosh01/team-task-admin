import { NextPage } from "next";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { activityListApi } from "@/services/api.service";
import { ActivityType } from "@/types/project";
import { formatDate } from "@/lib/formatDate";
import { Skeleton } from "../ui/skeleton";

interface Props {
  taskId: string;
}

const ActivitiesPage: NextPage<Props> = ({ taskId }) => {
  const [activities, setActivities] = useState<ActivityType[] | []>([]);
  const fetchActivity = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
      };
      const { results, nextOffset } = await activityListApi(taskId, query);
      return { data: results, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activities"],
      queryFn: fetchActivity,
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

  useEffect(() => {
    if (data) {
      const results = data.pages.flatMap((page) => page.data);
      setActivities(results);
    }
  }, [data, setActivities]);

  if (!activities.length && isFetching && !isFetchingNextPage) {
    return (
      <div className="border p-4 rounded-md">
        <div className="flex space-x-4 mt-4">
          <Skeleton className="h-8 w-24" /> {/* Comments Tab */}
          <Skeleton className="h-8 w-24" /> {/* Activity Tab */}
        </div>

        {/* Comment Input */}
        <div className="flex items-center space-x-4 mt-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return <div>No activities found.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {activities.map((activity: ActivityType, index: number) => (
        <Card
          key={index}
          className="border-x-0 border-b-1 border-t-0 rounded-none"
        >
          <CardContent>
            <div className="flex gap-4">
              {/* Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarImage />
                <AvatarFallback>
                  {activity.performedBy.slice(0, 2).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Activity Details */}
              <div className="flex-1">
                <div className="flex flex-col">
                  <p className="text-sm">
                    <span className="font-medium">{activity.performedBy}</span>{" "}
                    {activity.action === "created" && "created the task"}
                    {activity.action === "updated" &&
                      `updated the ${activity.key}`}
                  </p>
                  {activity.action === "updated" &&
                    activity.key !== "description" &&
                    activity.key !== "title" && (
                      <div className="text-xs mt-1 w-full flex items-center">
                        <div className="flex gap-2 items-center">
                          <span className="font-semibold text-muted-foreground capitalize">
                            {activity.key}:
                          </span>
                          <div className="flex items-center w-full">
                            <div className="p-1 bg-muted rounded-sm capitalize whitespace-nowrap ">
                              {activity?.previousValue?.replace("_", " ") ||
                                "Unassigned"}
                            </div>
                            <span className="-mt-1 px-1">→</span>{" "}
                            <div className="p-1 bg-muted rounded-sm">
                              <span className="whitespace-nowrap capitalize">
                                {activity?.newValue?.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(activity.updatedAt as string)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {hasNextPage && (
        <div ref={ref} className="text-center text-muted-foreground">
          {isFetchingNextPage ? "Loading more activities..." : "Load more"}
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
