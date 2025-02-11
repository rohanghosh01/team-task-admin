import { combineProviders } from "@/lib/combineProviders";
import { AuthProvider } from "@/contexts/authContext";
import { RootProvider } from "@/contexts/RootContext";
import { DashboardProvider } from "@/contexts/dashboardContext";
import { ProjectProvider } from "@/contexts/projectContext";
import { TaskProvider } from "@/contexts/taskContext";

const providers = [
  RootProvider,
  AuthProvider,
  DashboardProvider,
  ProjectProvider,
  TaskProvider,
];

export const AppProviders = combineProviders(providers);
