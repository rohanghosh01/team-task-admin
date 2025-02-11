"use client";

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
import { addProjectApi } from "@/services/api.service";
import { useRootContext } from "@/contexts/RootContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProject } from "@/contexts/projectContext";
import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description can not exceed 500 characters"),
  // Remove validation for select fields
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z.enum(["active", "on Hold", "completed"]).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange,
}: AddProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const { setShowMessage } = useRootContext();
  const { addProject } = useProject();

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Use setValue to set the default value for priority and status
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      // Set default values for priority and status
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "low",
      status: "active",
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      setLoading(true);
      let response = await addProjectApi({
        ...formData,
        name: formData.name.toLowerCase(),
      });
      queryClient.invalidateQueries();
      addProject(response);
      setLoading(false);
      reset(); // Reset the form after successful submission
      onOpenChange(false);
    } catch (error: any) {
      setShowMessage({
        message:
          error?.message || "Failed to create project. Please try again.",
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
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project and assign team members to start collaborating.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message as string}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the project objectives"
              />
              {errors.description && (
                <p className="text-red-500">
                  {errors.description.message as string}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  {...register("priority")}
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
                  {...register("status")}
                  defaultValue="active"
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on Hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-red-500">
                    {errors.startDate.message as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-red-500">
                    {errors.endDate.message as string}
                  </p>
                )}
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
              <Button disabled={loading}>
                <span>Creating...</span>
              </Button>
            ) : (
              <Button type="submit">Create Project</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
