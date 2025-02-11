"use client";

import { Suspense, use, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Edit3,
  MoreHorizontal,
  Plus,
  GitBranch,
  Loader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { taskDetailApi, updateTaskApi } from "@/services/api.service";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/color-helper";
import { useRootContext } from "@/contexts/RootContext";
import { formatDate } from "@/lib/formatDate";
import dynamic from "next/dynamic";
import { ChangeAssignee } from "@/components/tasks/change-assignee";
import { TaskLabels } from "@/components/tasks/task-labels";
import TaskDetailsSkeleton from "@/components/tasks/task-detail-skeketon";
import ActivitiesPage from "@/components/tasks/activity";
import { useQueryClient } from "@tanstack/react-query";
import CommentPage from "@/components/tasks/commnet";
const EditorComp = dynamic(() => import("@/components/markdown-editor"), {
  ssr: false,
});

import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "next-themes";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  assignee: string | null;
}

export default function TaskDetailsPage({ params }: any) {
  const { taskId, projectId }: any = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const { setShowMessage } = useRootContext();

  const updateTask = async (data: Partial<Task>) => {
    try {
      await updateTaskApi(taskId, data);
      setShowMessage({
        message: "Task updated successfully!",
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    } catch (error: any) {
      setShowMessage({
        message: error?.message || "Failed to update task",
        type: "error",
      });
      console.log("Failed to update task:", error);
    }
  };
  const handleEdit = (name: string) => {
    if (name === "title") {
      setIsEditTitle(true);
    } else {
      setIsEditing(true);
    }
  };
  const handleSave = async (name: string) => {
    if (task) {
      const { title, description } = task;
      if (name == "title") {
        await updateTask({ title });
        setIsEditTitle(false);
      } else {
        await updateTask({ description });
        setIsEditing(false);
      }
    }
    setIsEditing(false);
  };
  const handleChange = async (field: keyof Task, value: string) => {
    const updatedTask = { ...task, [field]: value };

    setTask(updatedTask as Task);

    if (field !== "description" && field !== "title") {
      await updateTask({ [field]: value });
    }
  };

  const fetchTask = async () => {
    try {
      setLoading(true);
      let result = await taskDetailApi(taskId);
      setTask(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Failed to fetch task:", error);
    }
  };
  const handleLabelsChange = async (newLabels: string[]) => {
    const updatedTask = { ...task, labels: newLabels };
    setTask(updatedTask as Task);
    await updateTask({ labels: newLabels });
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (loading) {
    return <TaskDetailsSkeleton />;
  }

  if (!loading && !task) {
    return (
      <div className="flex justify-center items-center">Task not found</div>
    );
  }

  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex items-center justify-between h-16 px-4 max-sm:flex-wrap max-sm:gap-1 max-sm:mb-5 ">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Task Details</h1>
              <Badge
                variant="secondary"
                className={cn(
                  getStatusColor(task?.status as string),
                  "text-sm capitalize"
                )}
              >
                {task?.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add subtask
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuItem>Move</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[1fr_300px] relative">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  {isEditTitle ? (
                    <div>
                      <Input
                        value={task?.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="text-xl font-semibold mb-4"
                        spellCheck
                        autoFocus
                      />
                      <div className="flex gap-2 sticky bottom-0 p-3 bg-background">
                        <Button
                          onClick={() => handleSave("title")}
                          className="bg-blue-400 hover:bg-blue-500 h-8"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setIsEditTitle(false)}
                          className="h-8"
                          variant="ghost"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4 group">
                      <h2
                        className="text-xl font-semibold cursor-text w-full"
                        onClick={() => handleEdit("title")}
                      >
                        {task?.title}
                      </h2>
                    </div>
                  )}
                  <Separator className="my-4" />
                  {isEditing ? (
                    <div className="space-y-4">
                      <h1 className="font-bold">Description</h1>
                      <Suspense fallback={null}>
                        <EditorComp
                          markdown={task?.description as string}
                          handler={(data) => handleChange("description", data)}
                          className="min-h-[200px]"
                        />
                      </Suspense>

                      <div className="flex gap-2 sticky bottom-0 p-3 bg-background">
                        <Button
                          onClick={() => handleSave("description")}
                          className="bg-blue-400 hover:bg-blue-500  h-8"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          className="h-8"
                          variant="ghost"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col group">
                      <h1 className="font-bold">Description</h1>
                      <Suspense fallback={null}>
                        <div
                          onClick={() => handleEdit("description")}
                          className="cursor-text"
                        >
                          <MarkdownPreview
                            source={task?.description}
                            style={{
                              padding: 16,
                              background: "transparent",
                            }}
                            wrapperElement={{
                              "data-color-mode": theme as any,
                            }}
                          />
                        </div>
                      </Suspense>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="comments" className="w-full">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  <CommentPage taskId={taskId} />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <ActivitiesPage taskId={taskId} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-20 right-9">
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-sm font-medium">Assignee</Label>
                    <ChangeAssignee projectId={projectId} task={task} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={task?.status as string}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">
                          <span>To Do</span>
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <span className="text-yellow-500"> In Progress</span>
                        </SelectItem>
                        <SelectItem value="in_review">
                          <span className="text-blue-500 ">In Review</span>
                        </SelectItem>
                        <SelectItem value="done">
                          <span className="text-green-500">Done</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select
                      value={task?.priority}
                      onValueChange={(value) => handleChange("priority", value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <span className="text-green-500">Low</span>
                        </SelectItem>
                        <SelectItem value="medium">
                          <span className="text-yellow-500">Medium</span>
                        </SelectItem>
                        <SelectItem value="high">
                          <span className="text-orange-500">High</span>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <span className=" text-red-500">Urgent</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TaskLabels
                    initialLabels={task?.labels}
                    onLabelsChange={(newLabels) =>
                      handleLabelsChange(newLabels)
                    }
                  />

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      Created {formatDate(task?.createdAt as string)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GitBranch className="w-4 h-4 mr-2" />
                      No linked branches
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
