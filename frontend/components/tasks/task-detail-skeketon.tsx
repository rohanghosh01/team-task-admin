import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailsSkeleton() {
  return (
    <div className="space-y-4 p-6  rounded-lg">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        {/* Task Details Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" /> {/* Task Title */}
          <Skeleton className="h-4 w-1/5" /> {/* Status */}
        </div>
        <Skeleton className="h-10 w-24" /> {/* Add Subtask Button */}
      </div>

      {/* Horizontal Layout */}
      <div className="flex space-x-4">
        
        {/* Task Details Section */}
        <div className="flex-1 rounded-lg p-4 space-y-4">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />
          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />

          <div className="border p-4 rounded-md">
            {/* Tabs */}
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
        </div>

        {/* Task Metadata Section */}
        <div className="w-1/3 border rounded-lg p-4 space-y-4">
          {/* Assignee */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Dropdown */}
          </div>
          {/* Status */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Dropdown */}
          </div>
          {/* Priority */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Dropdown */}
          </div>
          {/* Labels */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" /> {/* Label */}
            <Skeleton className="h-8 w-full" /> {/* Tags */}
          </div>
          {/* Metadata */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" /> {/* Created Date */}
            <Skeleton className="h-4 w-2/3" /> {/* No linked branches */}
          </div>
        </div>
      </div>
    </div>
  );
}
