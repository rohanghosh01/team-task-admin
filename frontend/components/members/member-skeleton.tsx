import { Skeleton } from "@/components/ui/skeleton";

export const MemberTableSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-transparent border-b px-4 py-2 font-semibold text-sm flex items-center">
        <div className="w-6 h-6 bg-muted rounded-sm mr-4"></div>
        <div className="flex-1 grid grid-cols-6 gap-4 text-muted-foreground">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined Date</span>
          <span>Password</span>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-muted">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="px-4 py-4 flex items-center hover:bg-muted/20"
          >
            {/* Checkbox Skeleton */}
            <Skeleton className="w-6 h-6 rounded-sm mr-4" />

            {/* Data Columns Skeleton */}
            <div className="flex-1 grid grid-cols-6 gap-4 items-center">
              {/* Name Column */}
              <Skeleton className="w-32 h-5 rounded col-span-1" />
              {/* Email Column */}
              <Skeleton className="w-40 h-5 rounded" />
              {/* Role Column */}
              <Skeleton className="w-20 h-5 rounded" />
              {/* Status Column */}
              <Skeleton className="w-16 h-5 rounded" />
              {/* Joined Date Column */}
              <Skeleton className="w-28 h-5 rounded" />
              {/* Password Column */}
              <Skeleton className="w-36 h-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
