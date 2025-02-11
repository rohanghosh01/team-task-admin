import { Skeleton } from "@/components/ui/skeleton";

export default function TaskTableSkeleton() {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Task
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Tags
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-1/4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-1/3" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-1/2" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-1/2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
