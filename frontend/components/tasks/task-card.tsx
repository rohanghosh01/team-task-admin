import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { Calendar, Tag, User2, UserCircle } from "lucide-react";
import { ToolTipProvider } from "../tooltip-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPriorityColor, getPriorityIcon } from "@/lib/color-helper";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${task?._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium text-sm truncate">{task.title}</h4>
            <Badge
              variant="secondary"
              className={cn(
                getPriorityColor(task.priority),
                "flex gap-2 items-center"
              )}
            >
              <span className="capitalize">{task.priority}</span>
              {getPriorityIcon(task.priority)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3 ">
          {/* <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p> */}
          {task?.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 5).map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {label}
                </Badge>
              ))}
              {task.labels.length > 5 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{task.labels.length - 5} more
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{task.dueDate}</span>
              </div>
            )}
            {task.assignee ? (
              <ToolTipProvider name={task.assignee?.name}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {task.assignee?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </ToolTipProvider>
            ) : (
              <div>
                <ToolTipProvider name="Unassigned">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User2 className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </ToolTipProvider>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
