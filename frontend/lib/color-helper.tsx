import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  CheckCircle,
  Circle,
} from "lucide-react";

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "low":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    default:
      return "";
  }
};
export const getStatusColor = (status: string) => {
  switch (status) {
    case "in_review":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "done":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "in_progress":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "todo":
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    default:
      return "";
  }
};

//"active", "completed", "hold", "archived"
export const projectStatusColor = (status: string) => {
  switch (status) {
    case "hold":
      return "bg-orange-500 text-orange-500 hover:bg-orange-500/20";
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "archived":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "active":
      return "";
    default:
      return "";
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "urgent":
      return <AlertCircle className="text-red-500 w-4 h-4" />;
    case "high":
      return <AlertTriangle className="text-orange-500 w-4 h-4" />;
    case "medium":
      return <CheckCircle className="text-yellow-500 w-4 h-4" />;
    case "low":
      return <ArrowDown className="text-green-500 w-4 h-4" />;
    default:
      return null;
  }
};
