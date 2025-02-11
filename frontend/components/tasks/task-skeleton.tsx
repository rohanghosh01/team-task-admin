import { Skeleton } from "@/components/ui/skeleton";

export const TaskCardSkeleton = () => {
  return (
    <div className="flex items-center p-4 space-x-4 border rounded-lg shadow-md h-[100px]">
      {/* Avatar Skeleton */}
      <Skeleton className="w-10 h-10 rounded-full" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 space-y-2">
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4" />
        {/* Subtitle Skeleton */}
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Tag Skeleton */}
      <Skeleton className="w-12 h-6 rounded" />
    </div>
  );
};
