import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
      {/* Members Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-20 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-20 h-4" />
        </CardContent>
      </Card>

      {/* Projects Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-24 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-20 h-4 mb-2" />
          <Skeleton className="w-24 h-4" />
        </CardContent>
      </Card>

      {/* Tasks Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-20 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-20 h-4 mb-2" />
          <Skeleton className="w-28 h-4 mb-2" />
          <Skeleton className="w-24 h-4" />
        </CardContent>
      </Card>

      {/* Projects Overview Skeleton */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-36 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-28 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Team Activity Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-28 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
