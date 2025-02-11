"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavItem } from "@/components/navigation/nav-item";
import { useAuth } from "@/contexts/authContext";

export function SideNav({
  className,
  setOpen,
}: {
  className?: string;
  setOpen?: any;
}) {
  const pathname = usePathname();
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === "admin";

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
      show: isAdmin,
    },
    {
      label: "Projects",
      icon: FolderKanban,
      href: "/dashboard/projects",
      color: "text-pink-700",
      show: true,
    },
    {
      label: "Team Members",
      icon: Users,
      href: "/dashboard/members",
      color: "text-violet-500",
      show: isAdmin,
    },

    // {
    //   label: "Chat",
    //   icon: MessageSquare,
    //   href: "/dashboard/chat",
    //   color: "text-orange-700",
    //   show: true,
    // },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "text-emerald-500",
      show: true,
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      show: true,
    },
  ];

  return (
    <nav className={cn("space-y-2 p-3 pt-6 max-sm:pt-14", className)}>
      {routes
        .filter((route) => route.show)
        .map((route) => (
          <div
            key={route.href}
            onClick={() => {
              if (setOpen !== undefined) setOpen(false);
            }}
          >
            <NavItem
              href={route.href}
              icon={route.icon}
              label={route.label}
              color={route.color}
              isActive={pathname === route.href}
            />
          </div>
        ))}
    </nav>
  );
}
