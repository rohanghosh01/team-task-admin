import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addTaskApi } from "@/services/api.service";
import { useRootContext } from "@/contexts/RootContext";
import { QueryClient } from "@tanstack/react-query";
import { useTask } from "@/contexts/taskContext";
import { Badge } from "../ui/badge";
const queryClient = new QueryClient();

interface AddTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("low"),
  labels: z.array(z.string()).optional(),
});

export function AddTaskDialog({
  projectId,
  open,
  onOpenChange,
}: AddTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState("");
  const { setShowMessage } = useRootContext();
  const { setNewTask } = useTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "low",
      labels: [],
    },
  });

  const addLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput("");
    }
  };

  const removeLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        labels,
        projectId,
      };
      await addTaskApi(data);
      setNewTask(true);
      queryClient.invalidateQueries();
      setShowMessage({
        message: "Task created successfully!",
        type: "success",
      });
      setLoading(false);
      reset();
      setLabels([]);
      onOpenChange(false);
    } catch (error: any) {
      console.log("Error creating task:", error);
      setShowMessage({
        message: error?.message || "Failed to create task",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to team members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message as string}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the task"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  defaultValue="low"
                  onValueChange={(val) => setValue("priority", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-red-500">
                    {errors.priority.message as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue="todo"
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="labels">Labels</Label>
              <Input
                id="labels"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLabel())
                }
                placeholder="Type a label and press Enter"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {labels.map((label) => (
                  <Badge
                    variant="secondary"
                    key={label}
                    className="flex items-center px-2 py-1 rounded-full"
                  >
                    <span className="mr-2">{label}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeLabel(label)}
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {loading ? (
              <Button disabled>Creating...</Button>
            ) : (
              <Button type="submit">Create Task</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
