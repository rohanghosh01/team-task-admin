export type ProjectStatus = "active" | "completed" | "hold" | "archived";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface Project {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: String;
  endDate?: String;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  progress?: number;
  tasksCount?: TasksCount;
  teamMembers?: string[];
}

export interface TasksCount {
  total?: number;
  completed?: number;
}

export interface ActivityType {
  _id: string;
  taskId: string;
  action: string;
  previousValue: string;
  newValue: string;
  key: string;
  message: string;
  performedBy: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentType {
  _id: string;
  taskId: string;
  isEdited: boolean;
  comment: string;
  user: User;
  tags?: any[];
  reactions: Reaction[];
  totalReactions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReactionType {
  _id: string;
  reaction: string;
  userId: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reaction {
  _id: string;
  reaction: string;
  userId: string;
  name: string;
  email: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface ChartType {
  _id: null;
  projectName?: string;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progress: number;
  taskByStatus: TaskByStatus;
  taskByPriority: TaskByPriority;
  totalMembers: number;
}

export interface TaskByPriority {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface TaskByStatus {
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
}
