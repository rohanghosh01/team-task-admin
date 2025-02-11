export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";

interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: TaskUser | null;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}

export interface TaskGroup {
  status: TaskStatus;
  tasks: Task[];
  totalCount?: number;
}

export interface countType {
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
}
