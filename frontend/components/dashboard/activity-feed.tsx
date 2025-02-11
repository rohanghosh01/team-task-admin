import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivityApi } from "@/services/api.service";
import { MessageSquare, GitPullRequest, FileEdit } from "lucide-react";
import { useEffect, useState } from "react";

export function ActivityFeed() {
  const activities = [
    {
      icon: MessageSquare,
      color: "text-blue-500",
      title: "New comment on 'Landing page design'",
      time: "5 minutes ago",
      description: "Sarah commented on the latest design iteration.",
    },
    {
      icon: GitPullRequest,
      color: "text-green-500",
      title: "Pull request merged",
      time: "2 hours ago",
      description: "Authentication feature has been merged into main.",
    },
    {
      icon: FileEdit,
      color: "text-purple-500",
      title: "Task updated",
      time: "4 hours ago",
      description: "API documentation has been updated with new endpoints.",
    },
  ];
  const [activity, setActivity] = useState<any>([]);

  const getActivity = async () => {
    try {
      const response = await recentActivityApi();
      setActivity(response);
    } catch (error) {}
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 rounded-lg border p-4"
          >
            <activity.icon className={`h-5 w-5 ${activity.color}`} />
            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
