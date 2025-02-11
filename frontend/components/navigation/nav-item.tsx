"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  color?: string;
  isActive?: boolean;
}

export function NavItem({
  href,
  icon: Icon,
  label,
  color,
  isActive,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent" : "transparent",
        "justify-start md:justify-start"
      )}
    >
      <Icon className={cn("h-5 w-5 md:mr-2", color)} />
      <span className="inline-flex max-sm:pl-4 ">{label}</span>
    </Link>
  );
}
